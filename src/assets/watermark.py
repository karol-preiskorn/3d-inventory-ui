#!/usr/bin/env python
# encoding: utf-8
#
# File:        /src/assets/watermark.py
# Description:
# Used by:
# Dependency:
#
# Date        By       Comments
# ----------  -------  ------------------------------
# 2023-07-15  C2RLO
#

import os
import argparse
import subprocess
import shlex

def validate_path(path):
    """Validate and sanitize file paths to prevent path traversal attacks"""
    if not path:
        raise ValueError("Path cannot be empty")

    # Resolve to absolute path and normalize
    abs_path = os.path.abspath(path)

    # Check for path traversal attempts
    if '..' in path or abs_path != os.path.normpath(abs_path):
        raise ValueError(f"Invalid path detected: {path}")

    return abs_path

def main():
    parser = argparse.ArgumentParser(description='Add watermarks to images in path')
    parser.add_argument('--root', help='Root path for images', required=True, type=str)
    parser.add_argument('--watermark', help='Path to watermark image', required=True, type=str)
    parser.add_argument('--name', help='Name addition for watermark', default="-watermark", type=str)
    parser.add_argument('--extension', help='Image extensions to look for', default=".png", type=str)
    parser.add_argument('--exclude', help='Path content to exclude', type=str)

    args = parser.parse_args()

    # Validate and sanitize paths
    try:
        args.root = validate_path(args.root)
        args.watermark = validate_path(args.watermark)

        # Verify paths exist
        if not os.path.exists(args.root):
            raise ValueError(f"Root path does not exist: {args.root}")
        if not os.path.exists(args.watermark):
            raise ValueError(f"Watermark file does not exist: {args.watermark}")

    except ValueError as e:
        print(f"Error: {e}")
        return 1

    files_processed = 0
    files_watermarked = 0

    # Sanitize path and use safe subprocess call
    safe_root = shlex.quote(args.root)
    try:
        subprocess.run(['rm', '-f'] + [f for f in os.listdir(args.root) if f.endswith('-watermark.png')],
                      cwd=args.root, check=False)
    except (OSError, subprocess.SubprocessError):
        print("Warning: Could not clean existing watermark files")

    for dirName, subdirList, fileList in os.walk(args.root):
        if args.exclude is not None and args.exclude in dirName:
            continue
        #print('Walking directory: %s' % dirName)
        for fname in fileList:
            files_processed += 1
            #print('  Processing %s' % os.path.join(dirName, fname))
            if args.extension in fname and args.watermark not in fname and args.name not in fname:
                ext = '.'.join(os.path.basename(fname).split('.')[1:])
                orig = os.path.join(dirName, fname)
                new_name = os.path.join(dirName, '%s.%s' % (os.path.basename(fname).split('.')[0] + args.name, ext))
                if not os.path.exists(new_name):
                    files_watermarked += 1
                    print('    Convert %s to %s' % (orig, new_name))
                    # Security fix: Use subprocess with proper argument escaping
                    try:
                        subprocess.run([
                            'composite',
                            '-dissolve', '25%',
                            '-gravity', 'SouthEast',
                            '-geometry', '+5+5',
                            args.watermark,
                            orig,
                            new_name
                        ], check=True, timeout=30)
                    except (subprocess.CalledProcessError, subprocess.TimeoutExpired, FileNotFoundError) as e:
                        print(f'    Error processing {orig}: {e}')

    print("Files Processed: %s" % "{:,}".format(files_processed))
    print("Files Watermarked: %s" % "{:,}".format(files_watermarked))


if __name__ == '__main__':
    main()
