'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">3d-inventory-angular-ui documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-AppModule-2d4ae9d2402952a0f9ea445c816c25d5c304535a766322d2b04ce5d11ebd993e69d611a462c5c268c4384206810cc0bea53c5c94ef4e521d40596a8534335dd0"' : 'data-bs-target="#xs-components-links-module-AppModule-2d4ae9d2402952a0f9ea445c816c25d5c304535a766322d2b04ce5d11ebd993e69d611a462c5c268c4384206810cc0bea53c5c94ef4e521d40596a8534335dd0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-2d4ae9d2402952a0f9ea445c816c25d5c304535a766322d2b04ce5d11ebd993e69d611a462c5c268c4384206810cc0bea53c5c94ef4e521d40596a8534335dd0"' :
                                            'id="xs-components-links-module-AppModule-2d4ae9d2402952a0f9ea445c816c25d5c304535a766322d2b04ce5d11ebd993e69d611a462c5c268c4384206810cc0bea53c5c94ef4e521d40596a8534335dd0"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AsyncObservablePipeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AsyncObservablePipeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AttributeAddComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AttributeAddComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AttributeDictionaryAddComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AttributeDictionaryAddComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AttributeDictionaryEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AttributeDictionaryEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AttributeDictionaryListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AttributeDictionaryListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AttributeEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AttributeEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AttributeListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AttributeListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConnectionAddComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConnectionAddComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConnectionEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConnectionEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConnectionListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConnectionListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CubeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CubeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DeviceAddComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceAddComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DeviceEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DeviceListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FloorAddComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FloorAddComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FloorEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FloorEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FloorListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FloorListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModelAddComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModelAddComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModelEditComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModelEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModelsListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModelsListComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-2d4ae9d2402952a0f9ea445c816c25d5c304535a766322d2b04ce5d11ebd993e69d611a462c5c268c4384206810cc0bea53c5c94ef4e521d40596a8534335dd0"' : 'data-bs-target="#xs-injectables-links-module-AppModule-2d4ae9d2402952a0f9ea445c816c25d5c304535a766322d2b04ce5d11ebd993e69d611a462c5c268c4384206810cc0bea53c5c94ef4e521d40596a8534335dd0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-2d4ae9d2402952a0f9ea445c816c25d5c304535a766322d2b04ce5d11ebd993e69d611a462c5c268c4384206810cc0bea53c5c94ef4e521d40596a8534335dd0"' :
                                        'id="xs-injectables-links-module-AppModule-2d4ae9d2402952a0f9ea445c816c25d5c304535a766322d2b04ce5d11ebd993e69d611a462c5c268c4384206810cc0bea53c5c94ef4e521d40596a8534335dd0"' }>
                                        <li class="link">
                                            <a href="injectables/AttributeDictionaryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AttributeDictionaryService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AttributeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AttributeService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CustomErrorHandler.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CustomErrorHandler</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DeviceService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FloorService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FloorService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LogService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ModelsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModelsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Attribute.html" data-type="entity-link" >Attribute</a>
                            </li>
                            <li class="link">
                                <a href="classes/AttributeDictionary.html" data-type="entity-link" >AttributeDictionary</a>
                            </li>
                            <li class="link">
                                <a href="classes/Bug.html" data-type="entity-link" >Bug</a>
                            </li>
                            <li class="link">
                                <a href="classes/ComponentDictionary.html" data-type="entity-link" >ComponentDictionary</a>
                            </li>
                            <li class="link">
                                <a href="classes/Connection.html" data-type="entity-link" >Connection</a>
                            </li>
                            <li class="link">
                                <a href="classes/Device.html" data-type="entity-link" >Device</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceCategory.html" data-type="entity-link" >DeviceCategory</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceCategoryDict.html" data-type="entity-link" >DeviceCategoryDict</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceList.html" data-type="entity-link" >DeviceList</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceType.html" data-type="entity-link" >DeviceType</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceTypeDict.html" data-type="entity-link" >DeviceTypeDict</a>
                            </li>
                            <li class="link">
                                <a href="classes/Model.html" data-type="entity-link" >Model</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModelsList.html" data-type="entity-link" >ModelsList</a>
                            </li>
                            <li class="link">
                                <a href="classes/Rack.html" data-type="entity-link" >Rack</a>
                            </li>
                            <li class="link">
                                <a href="classes/Tools3D.html" data-type="entity-link" >Tools3D</a>
                            </li>
                            <li class="link">
                                <a href="classes/Validation.html" data-type="entity-link" >Validation</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ConnectionService.html" data-type="entity-link" >ConnectionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TemplatePageTitleStrategy.html" data-type="entity-link" >TemplatePageTitleStrategy</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/ResolverDevice.html" data-type="entity-link" >ResolverDevice</a>
                            </li>
                            <li class="link">
                                <a href="guards/ResolverModel.html" data-type="entity-link" >ResolverModel</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ComponentDictionaryItem.html" data-type="entity-link" >ComponentDictionaryItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConnectionInterface.html" data-type="entity-link" >ConnectionInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeviceInterface.html" data-type="entity-link" >DeviceInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeviceTypeInterface.html" data-type="entity-link" >DeviceTypeInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Dimension.html" data-type="entity-link" >Dimension</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Floor.html" data-type="entity-link" >Floor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FloorDimension.html" data-type="entity-link" >FloorDimension</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Log.html" data-type="entity-link" >Log</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LogIn.html" data-type="entity-link" >LogIn</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LogParamteres.html" data-type="entity-link" >LogParamteres</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Position.html" data-type="entity-link" >Position</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Texture.html" data-type="entity-link" >Texture</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});