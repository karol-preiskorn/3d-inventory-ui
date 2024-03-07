/**
 * @file /src/theme.js
 * @module /src
 * @description This file contains the code for the color mode toggler in Bootstrap's docs.
 * It allows the user to switch between light and dark themes, and stores the user's preferred theme in local storage.
 * The code also listens for changes in the user's preferred color scheme and updates the theme accordingly.
 * @version 2024-03-07 C2RLO - Initial
 **/

/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2023 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

;(() => {
  'use strict'

  /**
   * Retrieves the stored theme from local storage.
   * @returns {string|null} The stored theme, or null if no theme is stored.
   */
  const getStoredTheme = () => localStorage.getItem('theme')

  /**
   * Stores the specified theme in local storage.
   * @param {string} theme - The theme to be stored.
   */
  const setStoredTheme = (theme) => localStorage.setItem('theme', theme)

  /**
   * Retrieves the preferred theme based on the user's settings.
   * If a theme is stored, it is returned. Otherwise, it checks the user's preferred color scheme and returns 'dark' or 'light' accordingly.
   * @returns {string} The preferred theme.
   */
  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme()
    if (storedTheme) {
      return storedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  /**
   * Sets the theme for the document's root element.
   * If the theme is 'auto' and the user's preferred color scheme is dark, it sets the theme to 'dark'.
   * Otherwise, it sets the theme to the specified value.
   * @param {string} theme - The theme to be set.
   */
  const setTheme = (theme) => {
    if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-bs-theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme)
    }
  }

  setTheme(getPreferredTheme())

  /**
   * Updates the active theme in the UI.
   * @param {string} theme - The active theme.
   * @param {boolean} [focus=false] - Whether to focus on the theme switcher element.
   */
  const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher = document.querySelector('#bd-theme')

    if (!themeSwitcher) {
      return
    }

    const themeSwitcherText = document.querySelector('#bd-theme-text')
    const activeThemeIcon = document.querySelector('.theme-icon-active use')
    const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)
    const svgOfActiveBtn = btnToActive.querySelector('svg use').getAttribute('href')

    document.querySelectorAll('[data-bs-theme-value]').forEach((element) => {
      element.classList.remove('active')
      element.setAttribute('aria-pressed', 'false')
    })

    btnToActive.classList.add('active')
    btnToActive.setAttribute('aria-pressed', 'true')
    activeThemeIcon.setAttribute('href', svgOfActiveBtn)
    const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`
    themeSwitcher.setAttribute('aria-label', themeSwitcherLabel)

    if (focus) {
      themeSwitcher.focus()
    }
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const storedTheme = getStoredTheme()
    if (storedTheme !== 'light' && storedTheme !== 'dark') {
      setTheme(getPreferredTheme())
    }
  })

  window.addEventListener('DOMContentLoaded', () => {
    showActiveTheme(getPreferredTheme())

    document.querySelectorAll('[data-bs-theme-value]').forEach((toggle) => {
      toggle.addEventListener('click', () => {
        const theme = toggle.getAttribute('data-bs-theme-value')
        setStoredTheme(theme)
        setTheme(theme)
        showActiveTheme(theme, true)
      })
    })
  })
})()
