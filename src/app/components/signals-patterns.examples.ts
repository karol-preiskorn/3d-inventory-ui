/**
 * 🚀 ANGULAR SIGNALS EXAMPLES - Component State Management Patterns
 * This file demonstrates various Angular Signals patterns for different component types.
 * These patterns can be applied across your application for consistent, reactive state management.
 */

// ═══════════════════════════════════════════════════════════════════════════════════
// 📋 PATTERN 1: LIST COMPONENT with Loading, Filtering, and Pagination
// ═══════════════════════════════════════════════════════════════════════════════════

import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Observable } from 'rxjs'

// Import shared models and services
import { Device } from '../shared/device'
import { Model } from '../shared/model'
import { DeviceService } from '../services/device.service'

@Component({
  selector: 'app-device-list-signals',
  template: `
    <!-- Search and filters -->
    <input
      type="text"
      [value]="searchTerm()"
      (input)="searchTerm.set($event.target.value)"
      placeholder="Search devices...">

    <!-- Loading state -->
    @if (isLoading()) {
      <div class="spinner">Loading devices...</div>
    }

    <!-- Device list with computed filtering -->
    @for (device of filteredDevices(); track device._id) {
      <div class="device-card">
        <h4>{{ device.name }}</h4>
        <p>Model: {{ getModelName(device.modelId) }}</p>
      </div>
    }

    <!-- Pagination -->
    <div class="pagination">
      Page {{ currentPage() }} of {{ totalPages() }}
      <button (click)="previousPage()" [disabled]="currentPage() === 1">Previous</button>
      <button (click)="nextPage()" [disabled]="currentPage() === totalPages()">Next</button>
    </div>

    <!-- Summary stats -->
    <div class="stats">
      Showing {{ filteredDevices().length }} of {{ allDevices().length }} devices
      @if (searchTerm()) {
        <span> (filtered by "{{ searchTerm() }}")</span>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeviceListSignalsComponent {
  // 📊 Primary state signals
  readonly allDevices = signal<Device[]>([])
  readonly allModels = signal<Model[]>([])
  readonly isLoading = signal(false)
  readonly hasError = signal(false)
  readonly errorMessage = signal('')

  // 🔍 Filter and pagination signals
  readonly searchTerm = signal('')
  readonly currentPage = signal(1)
  readonly pageSize = signal(10)

  // 🧮 Computed signals - automatically recalculate when dependencies change
  readonly filteredDevices = computed(() => {
    const search = this.searchTerm().toLowerCase()
    const devices = this.allDevices()
    if (!search) {
      return devices
    }

    return devices.filter(device =>
      device.name.toLowerCase().includes(search) ||
      device.modelId.toLowerCase().includes(search)
    )
  })

  readonly totalPages = computed(() =>
    Math.ceil(this.filteredDevices().length / this.pageSize())
  )

  readonly paginatedDevices = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize()
    const end = start + this.pageSize()
    return this.filteredDevices().slice(start, end)
  })

  constructor(private deviceService: DeviceService) {
    // 🔄 Effect: Reset to page 1 when search changes
    effect(() => {
      this.searchTerm() // Register dependency
      this.currentPage.set(1) // Reset pagination
    })

    // 🔄 Effect: Log filtering results (development only)
    effect(() => {
      const total = this.allDevices().length
      const filtered = this.filteredDevices().length
      console.warn(`📊 Filtering: ${filtered}/${total} devices shown`)
    })
  }

  // 📥 Load data methods
  loadDevices(): void {
    this.isLoading.set(true)
    this.hasError.set(false)

    this.deviceService.GetDevices().subscribe({
      next: (devices: Device[]) => {
        this.allDevices.set(devices)
        this.isLoading.set(false)
      },
      error: (_error: unknown) => {
        this.hasError.set(true)
        this.errorMessage.set('Failed to load devices')
        this.isLoading.set(false)
      }
    })
  }

  // 📄 Pagination methods using signal updates
  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1)
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1)
    }
  }

  // 🔍 Helper methods using computed lookups
  getModelName(modelId: string): string {
    return this.allModels().find(model => model._id === modelId)?.name || 'Unknown'
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════
// 📝 PATTERN 2: FORM COMPONENT with Reactive State and Validation
// ═══════════════════════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-device-form-signals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">

      <!-- Form fields with signal-driven validation feedback -->
      <div class="form-group">
        <input formControlName="name" placeholder="Device name">
        @if (nameValidation().hasError) {
          <div class="error">{{ nameValidation().message }}</div>
        }
      </div>

      <!-- Dynamic model selection -->
      <select formControlName="modelId">
        <option value="">Select a model...</option>
        @for (model of availableModels(); track model._id) {
          <option [value]="model._id">{{ model.name }}</option>
        }
      </select>

      <!-- Form state indicators -->
      <div class="form-status">
        @if (isFormValid()) {
          <span class="text-success">✓ Form is valid</span>
        } @else {
          <span class="text-danger">Form has {{ validationErrors().length }} error(s)</span>
        }

        @if (isDirty()) {
          <span class="text-warning">Unsaved changes</span>
        }
      </div>

      <!-- Submit button with reactive state -->
      <button
        type="submit"
        [disabled]="!canSubmit()"
        [class.loading]="isSubmitting()">
        @if (isSubmitting()) {
          <span>Saving...</span>
        } @else {
          <span>Save Device</span>
        }
      </button>

    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeviceFormSignalsComponent {
  // 📝 Form state signals
  readonly isSubmitting = signal(false)
  readonly hasSubmitError = signal(false)
  readonly submitErrorMessage = signal('')
  readonly isDirty = signal(false)

  // 📊 Data signals
  readonly availableModels = signal<Model[]>([])
  readonly currentDevice = signal<Device | null>(null)

  // 🧮 Computed validation signals
  readonly nameValidation = computed(() => {
    const nameControl = this.form.get('name')
    if (!nameControl) {return { hasError: false, message: '' }}

    if (nameControl.errors?.['required']) {
      return { hasError: true, message: 'Device name is required' }
    }
    if (nameControl.errors?.['minlength']) {
      return { hasError: true, message: 'Name must be at least 3 characters' }
    }
    return { hasError: false, message: '' }
  })

  readonly isFormValid = computed(() => this.form.valid)

  readonly validationErrors = computed(() => {
    const errors: string[] = []
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key)
      if (control?.errors) {
        errors.push(`${key} is invalid`)
      }
    })
    return errors
  })

  readonly canSubmit = computed(() =>
    this.isFormValid() && !this.isSubmitting()
  )

  // 🏗️ Form setup (will be initialized in constructor)
  readonly form: ReturnType<FormBuilder['group']>

  constructor(private fb: FormBuilder, private deviceService: DeviceService) {
    // Initialize form
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      modelId: ['', Validators.required],
      description: ['']
    })

    // 🔄 Effect: Track form dirty state
    effect(() => {
      this.form.valueChanges.subscribe(() => {
        this.isDirty.set(this.form.dirty)
      })
    })
  }

  // 💾 Submit with signal state management
  onSubmit(): void {
    if (!this.canSubmit()) {
      return
    }

    this.isSubmitting.set(true)
    this.hasSubmitError.set(false)

    // Create proper Device object
    const formValue = this.form.value
    const deviceData = new Device(
      formValue.name || '',
      formValue.modelId || ''
    )

    this.deviceService.CreateDevice(deviceData).subscribe({
      next: (savedDevice: Device) => {
        this.currentDevice.set(savedDevice)
        this.isSubmitting.set(false)
        this.isDirty.set(false)
        // Success feedback
      },
      error: (_error: unknown) => {
        this.hasSubmitError.set(true)
        this.submitErrorMessage.set('Failed to save device')
        this.isSubmitting.set(false)
      }
    })
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════
// 🎨 PATTERN 3: UI STATE COMPONENT with Theme and Preferences
// ═══════════════════════════════════════════════════════════════════════════════════

@Component({
  selector: 'app-theme-manager',
  template: `
    <div class="theme-controls">

      <!-- Theme selector with signal binding -->
      <select [value]="currentTheme()" (change)="setTheme($any($event.target).value)">
        @for (theme of availableThemes(); track theme.id) {
          <option [value]="theme.id">{{ theme.name }}</option>
        }
      </select>

      <!-- Dark mode toggle -->
      <label class="toggle">
        <input
          type="checkbox"
          [checked]="isDarkMode()"
          (change)="toggleDarkMode()">
        Dark Mode
      </label>

      <!-- Theme preview -->
      <div class="theme-preview" [attr.data-theme]="currentTheme()">
        <p>Preview with {{ currentTheme() }} theme</p>
        <button class="btn btn-primary">Primary Button</button>
        <button class="btn btn-secondary">Secondary Button</button>
      </div>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeManagerComponent {
  // 🎨 Theme state signals
  readonly currentTheme = signal('light')
  readonly isDarkMode = signal(false)
  readonly isHighContrast = signal(false)

  // 📊 Available themes
  readonly availableThemes = signal([
    { id: 'light', name: 'Light Theme' },
    { id: 'dark', name: 'Dark Theme' },
    { id: 'blue', name: 'Blue Theme' },
    { id: 'green', name: 'Nature Theme' }
  ])

  // 🧮 Computed theme classes
  readonly bodyClasses = computed(() => {
    const classes = [`theme-${this.currentTheme()}`]
    if (this.isDarkMode()) {classes.push('dark-mode')}
    if (this.isHighContrast()) {classes.push('high-contrast')}
    return classes.join(' ')
  })

  constructor() {
    // 🔄 Effect: Apply theme to document body
    effect(() => {
      const body = document.body
      body.className = this.bodyClasses()
    })

    // 🔄 Effect: Save theme preference to localStorage
    effect(() => {
      const themeData = {
        theme: this.currentTheme(),
        darkMode: this.isDarkMode(),
        highContrast: this.isHighContrast()
      }
      localStorage.setItem('theme-preferences', JSON.stringify(themeData))
    })

    // Load saved theme on init
    this.loadSavedTheme()
  }

  // 🎨 Theme control methods
  setTheme(themeId: string): void {
    this.currentTheme.set(themeId)
  }

  toggleDarkMode(): void {
    this.isDarkMode.update(current => !current)
  }

  toggleHighContrast(): void {
    this.isHighContrast.update(current => !current)
  }

  private loadSavedTheme(): void {
    const saved = localStorage.getItem('theme-preferences')
    if (saved) {
      try {
        const themeData = JSON.parse(saved)
        this.currentTheme.set(themeData.theme || 'light')
        this.isDarkMode.set(themeData.darkMode || false)
        this.isHighContrast.set(themeData.highContrast || false)
      } catch {
        // Use defaults if parsing fails
      }
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════════
// 🔄 PATTERN 4: ASYNC DATA LOADING with Signals
// ═══════════════════════════════════════════════════════════════════════════════════

export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

/**
 * 🚀 Custom Signal-based data loader
 */
export function createAsyncSignal<T>(
  loadFn: () => Observable<T>,
  initialValue: T | null = null
) {
  const state = signal<AsyncState<T>>({
    data: initialValue,
    loading: false,
    error: null,
    lastUpdated: null
  })

  const load = () => {
    state.update(current => ({
      ...current,
      loading: true,
      error: null
    }))

    loadFn().subscribe({
      next: (data: T) => {
        state.set({
          data,
          loading: false,
          error: null,
          lastUpdated: new Date()
        })
      },
      error: (_error: unknown) => {
        state.update(current => ({
          ...current,
          loading: false,
          error: 'An error occurred while loading data'
        }))
      }
    })
  }

  // Computed helpers
  const data = computed(() => state().data)
  const loading = computed(() => state().loading)
  const error = computed(() => state().error)
  const hasError = computed(() => !!state().error)
  const hasData = computed(() => !!state().data)

  return {
    state: state.asReadonly(),
    data: data,
    loading: loading,
    error: error,
    hasError: hasError,
    hasData: hasData,
    load,
    reload: load,
    reset: () => state.set({
      data: initialValue,
      loading: false,
      error: null,
      lastUpdated: null
    })
  }
}

// Usage example:
@Component({
  selector: 'app-data-loader-example',
  standalone: true,
  imports: [CommonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (devices.loading()) {
      <div class="loading">Loading devices...</div>
    }

    @if (devices.hasError()) {
      <div class="error">
        Error: {{ devices.error() }}
        <button (click)="devices.reload()">Retry</button>
      </div>
    }

    @if (devices.hasData()) {
      <div class="device-list">
        @for (device of devices.data(); track device._id) {
          <div class="device-item">{{ device.name }}</div>
        }
      </div>

      <div class="data-info">
        Last updated: {{ devices.state().lastUpdated | date:'short' }}
        <button (click)="devices.reload()">Refresh</button>
      </div>
    }
  `
})
export class DataLoaderExampleComponent {
  readonly devices = createAsyncSignal(
    () => this.deviceService.GetDevices(),
    []
  )

  constructor(private deviceService: DeviceService) {
    // Auto-load on init
    this.devices.load()
  }
}
