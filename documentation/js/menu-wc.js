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
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-4587b4da55b0115e8333180f09c06145d8fe7d50ca4bbf57c98017f385de59892ecc58656e56c18b7d2f4017d080394e5b8e8f04e5d9cb79739fefef718e380a"' : 'data-target="#xs-components-links-module-AppModule-4587b4da55b0115e8333180f09c06145d8fe7d50ca4bbf57c98017f385de59892ecc58656e56c18b7d2f4017d080394e5b8e8f04e5d9cb79739fefef718e380a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-4587b4da55b0115e8333180f09c06145d8fe7d50ca4bbf57c98017f385de59892ecc58656e56c18b7d2f4017d080394e5b8e8f04e5d9cb79739fefef718e380a"' :
                                            'id="xs-components-links-module-AppModule-4587b4da55b0115e8333180f09c06145d8fe7d50ca4bbf57c98017f385de59892ecc58656e56c18b7d2f4017d080394e5b8e8f04e5d9cb79739fefef718e380a"' }>
                                            <li class="link">
                                                <a href="components/AddDeviceComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddDeviceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CubeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CubeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DeviceOperationsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeviceOperationsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DevicesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DevicesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DevicesListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DevicesListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditDeviceComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditDeviceComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModelComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModelComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-4587b4da55b0115e8333180f09c06145d8fe7d50ca4bbf57c98017f385de59892ecc58656e56c18b7d2f4017d080394e5b8e8f04e5d9cb79739fefef718e380a"' : 'data-target="#xs-injectables-links-module-AppModule-4587b4da55b0115e8333180f09c06145d8fe7d50ca4bbf57c98017f385de59892ecc58656e56c18b7d2f4017d080394e5b8e8f04e5d9cb79739fefef718e380a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-4587b4da55b0115e8333180f09c06145d8fe7d50ca4bbf57c98017f385de59892ecc58656e56c18b7d2f4017d080394e5b8e8f04e5d9cb79739fefef718e380a"' :
                                        'id="xs-injectables-links-module-AppModule-4587b4da55b0115e8333180f09c06145d8fe7d50ca4bbf57c98017f385de59892ecc58656e56c18b7d2f4017d080394e5b8e8f04e5d9cb79739fefef718e380a"' }>
                                        <li class="link">
                                            <a href="injectables/DevicesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DevicesService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LogService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LogService</a>
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
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Bug.html" data-type="entity-link" >Bug</a>
                            </li>
                            <li class="link">
                                <a href="classes/Device.html" data-type="entity-link" >Device</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceCategories.html" data-type="entity-link" >DeviceCategories</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceList.html" data-type="entity-link" >DeviceList</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeviceTypes.html" data-type="entity-link" >DeviceTypes</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/MarkdownService.html" data-type="entity-link" >MarkdownService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/DataDeviceType.html" data-type="entity-link" >DataDeviceType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeviceCategoriesInterfance.html" data-type="entity-link" >DeviceCategoriesInterfance</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
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
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});