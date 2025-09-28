import { Routes } from '@angular/router'

export const ATTRIBUTES_ROUTES: Routes = [
  {
    path: 'attributes',
    children: [
      {
        path: '',
        loadComponent: () => import('../../components/attribute/attribute-list/attribute-list.component').then(m => m.AttributeListComponent),
        title: 'Attribute List'
      },
      {
        path: 'add',
        loadComponent: () => import('../../components/attribute/add-attribute/add-attribute.component').then(m => m.AttributeAddComponent),
        title: 'Add Attribute'
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('../../components/attribute/edit-attribute/edit-attribute.component').then(m => m.AttributeEditComponent),
        title: 'Edit Attribute'
      }
    ]
  },
  {
    path: 'attribute-dictionary',
    children: [
      {
        path: '',
        loadComponent: () => import('../../components/attribute-dictionary/attribute-dictionary-list/attribute-dictionary-list.component').then(m => m.AttributeDictionaryListComponent),
        title: 'Attribute Dictionary List'
      },
      {
        path: 'add',
        loadComponent: () => import('../../components/attribute-dictionary/add-attribute-dictionary/add-attribute-dictionary.component').then(m => m.AttributeDictionaryAddComponent),
        title: 'Add Attribute Dictionary'
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('../../components/attribute-dictionary/edit-attribute-dictionary/edit-attribute-dictionary.component').then(m => m.AttributeDictionaryEditComponent),
        title: 'Edit Attribute Dictionary'
      }
    ]
  }
]
