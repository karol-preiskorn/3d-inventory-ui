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
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
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
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AttributeAddComponent.html" data-type="entity-link" >AttributeAddComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AttributeDictionaryAddComponent.html" data-type="entity-link" >AttributeDictionaryAddComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AttributeDictionaryEditComponent.html" data-type="entity-link" >AttributeDictionaryEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AttributeDictionaryListComponent.html" data-type="entity-link" >AttributeDictionaryListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AttributeEditComponent.html" data-type="entity-link" >AttributeEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AttributeListComponent.html" data-type="entity-link" >AttributeListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConnectionAddComponent.html" data-type="entity-link" >ConnectionAddComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConnectionEditComponent.html" data-type="entity-link" >ConnectionEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConnectionListComponent.html" data-type="entity-link" >ConnectionListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CubeComponent.html" data-type="entity-link" >CubeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DeviceAddComponent.html" data-type="entity-link" >DeviceAddComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DeviceEditComponent.html" data-type="entity-link" >DeviceEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DeviceListComponent.html" data-type="entity-link" >DeviceListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FloorAddComponent.html" data-type="entity-link" >FloorAddComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FloorEditComponent.html" data-type="entity-link" >FloorEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FloorListComponent.html" data-type="entity-link" >FloorListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HomeComponent.html" data-type="entity-link" >HomeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LogComponent.html" data-type="entity-link" >LogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ModelAddComponent.html" data-type="entity-link" >ModelAddComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ModelEditComponent.html" data-type="entity-link" >ModelEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ModelsListComponent.html" data-type="entity-link" >ModelsListComponent</a>
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
                                <a href="classes/AttributesDictionary.html" data-type="entity-link" >AttributesDictionary</a>
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
                                <a href="classes/DeviceType.html" data-type="entity-link" >DeviceType</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceTypeDict.html" data-type="entity-link" >DeviceTypeDict</a>
                            </li>
                            <li class="link">
                                <a href="classes/Model.html" data-type="entity-link" >Model</a>
                            </li>
                            <li class="link">
                                <a href="classes/Tools3D.html" data-type="entity-link" >Tools3D</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnitDictionary.html" data-type="entity-link" >UnitDictionary</a>
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
                                    <a href="injectables/AttributeDictionaryService.html" data-type="entity-link" >AttributeDictionaryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AttributeService.html" data-type="entity-link" >AttributeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConnectionService.html" data-type="entity-link" >ConnectionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DeviceService.html" data-type="entity-link" >DeviceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FloorService.html" data-type="entity-link" >FloorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LogService.html" data-type="entity-link" >LogService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ModelsService.html" data-type="entity-link" >ModelsService</a>
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
                                <a href="interfaces/FloorDimension.html" data-type="entity-link" >FloorDimension</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Floors.html" data-type="entity-link" >Floors</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Log.html" data-type="entity-link" >Log</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LogIn.html" data-type="entity-link" >LogIn</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LogParameters.html" data-type="entity-link" >LogParameters</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Position.html" data-type="entity-link" >Position</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Texture.html" data-type="entity-link" >Texture</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UnitDictionaryItem.html" data-type="entity-link" >UnitDictionaryItem</a>
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
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
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