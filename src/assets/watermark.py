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
from werkzeug.security import safe_join
import subprocess

def main():
    parser = argparse.ArgumentParser(description='Add watermarks to images in path')
    parser.add_argument('--root', help='Root path for images', required=True, type=str)
    parser.add_argument('--watermark', help='Path to watermark image', required=True, type=str)
    parser.add_argument('--name', help='Name addition for watermark', default="-watermark", type=str)
    parser.add_argument('--extension', help='Image extensions to look for', default=".png", type=str)
    parser.add_argument('--exclude', help='Path content to exclude', type=str)

    args = parser.parse_args()

    files_processed = 0
    files_watermarked = 0
    subprocess.call(['rm', '%s//*-watermark.png' % (args.root)])
    for dirName, subdirList, fileList in os.walk(safe_join(os.getcwd(), args.root)):
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
                    subprocess.call(['composite', '-dissolve', '25%', '-gravity', 'SouthEast', '-geometry', '+5+5', args.watermark, orig, new_name])

    print("Files Processed: %s" % "{:,}".format(files_processed))
    print("Files Watermarked: %s" % "{:,}".format(files_watermarked))


if __name__ == '__main__':
    main()
