import { MarkdownModule } from 'ngx-markdown';
import { NgxPaginationModule } from 'ngx-pagination';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Add this line
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
    AttributeDictionaryAddComponent
} from './components/attribute-dictionary/add-attribute-dictionary/add-attribute-dictionary.component';
import {
    AttributeDictionaryListComponent
} from './components/attribute-dictionary/attribute-dictionary-list/attribute-dictionary-list.component';
import {
    AttributeDictionaryEditComponent
} from './components/attribute-dictionary/edit-attribute-dictionary/edit-attribute-dictionary.component';
import {
    AttributeAddComponent
} from './components/attribute/add-attribute/add-attribute.component';
import {
    AttributeListComponent
} from './components/attribute/attribute-list/attribute-list.component';
import {
    AttributeEditComponent
} from './components/attribute/edit-attribute/edit-attribute.component';
import {
    ConnectionAddComponent
} from './components/connection/add-connection/add-connection.component';
import {
    ConnectionListComponent
} from './components/connection/connection-list/connection-list.component';
import {
    ConnectionEditComponent
} from './components/connection/edit-connection/edit-connection.component';
import { CubeComponent } from './components/cube/cube.component';
import { DeviceAddComponent } from './components/devices/add-device/add-device.component';
import { DeviceListComponent } from './components/devices/devices-list/devices-list.component';
import { DeviceEditComponent } from './components/devices/edit-device/edit-device.component';
import { FloorAddComponent } from './components/floors/add-floor/add-floor.component';
import { FloorEditComponent } from './components/floors/edit-floor/edit-floor.component';
import { FloorListComponent } from './components/floors/floor-list/floor-list.component';
import { HomeComponent } from './components/home/home.component';
import { LogComponent } from './components/log/log.component';
import { ModelAddComponent } from './components/models/add-model/add-model.component';
import { ModelEditComponent } from './components/models/edit-model/edit-model.component';
import { ModelsListComponent } from './components/models/model-list/model-list.component';
import { AttributeDictionaryService } from './services/attribute-dictionary.service';
import { AttributeService } from './services/attribute.service';
import { DeviceService } from './services/device.service';
import { CustomErrorHandler } from './services/errorHandler.service';
import { FloorService } from './services/floor.service';
import { LogService } from './services/log.service';
import { ModelsService } from './services/models.service';

@NgModule({
  declarations: [
    DeviceListComponent,
    DeviceAddComponent,
    DeviceEditComponent,

    ModelsListComponent,
    ModelAddComponent,
    ModelEditComponent,

    AttributeDictionaryListComponent,
    AttributeDictionaryAddComponent,
    AttributeDictionaryEditComponent,

    AttributeListComponent,
    AttributeAddComponent,
    AttributeEditComponent,

    AppComponent,
    HomeComponent,
    CubeComponent,

    ConnectionListComponent,
    ConnectionAddComponent,
    ConnectionEditComponent,

    FloorListComponent,
    FloorEditComponent,
    FloorAddComponent,

    LogComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    HttpClientModule, // Add this line
    MarkdownModule,
    NgbPopoverModule,
    NgxPaginationModule,
    ReactiveFormsModule,
  ],
  providers: [
    DeviceService,
    ModelsService,
    LogService,
    AttributeDictionaryService,
    AttributeService,
    FloorService,
    CustomErrorHandler,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
