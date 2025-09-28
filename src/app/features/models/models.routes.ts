import { Routes } from '@angular/router'

export const MODELS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../components/models/model-list/model-list.component').then(m => m.ModelsListComponent),
    title: 'Models List'
  },
  {
    path: 'add',
    loadComponent: () => import('../../components/models/add-model/add-model.component').then(m => m.ModelAddComponent),
    title: 'Add Model'
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('../../components/models/edit-model/edit-model.component').then(m => m.ModelEditComponent),
    title: 'Edit Model'
  }
]
