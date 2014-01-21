/** SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. **/

/**
 * Document browser settings
 */
Ext.ns("Sbi.settings.geobi");


Sbi.settings.geobi.tools = {
	dataset: {
		filedatasetpanel: {
			supportedEncodings: [
			   ['windows-1252', 'windows-1252']
			   , ['UTF-8', 'UTF-8']
			   , ['UTF-16','UTF-16']
			   , ['US-ASCII','US-ASCII']
			   , ['ISO-8859-1','ISO-8859-1']
       	    ]
			, defaultEncoding: "windows-1252"
		}
	}
};

/**
 * Execution panel settings
 */
Sbi.settings.geobi.execution = {
    toolbar:{
		hideForEngineLabels: ['Gis Engine'] //list of engines without toolbar
	}
};

/**
 * MyData settings
 */
Sbi.settings.geobi.mydata = {
	// the toolbar that appears when a new document is created over a dataset
	// TODO: make it configurable on doc type basis
	toolbar: {
		hide: true
	}
	, hiddenActions: ['worksheet', 'qbe']
	/**
	 * MY DATA :
	 * put false for previous behavior (all USER public ds + owned)
	 * put true for showing only owned datasets
	 */
	, showOnlyOwner: false
}






/**
 * Document browser settings
 */
Sbi.settings.geobi.browser = {
		mexport: {
			massiveExportWizard: {
				resizable: true
			}
			, massiveExportWizardOptionsPage: {
				
			}, massiveExportWizardParametersPage: {
				
			}
			, massiveExportWizardTriggerPage: {
				showJobDetails: false
			}
		}
	  , showLeftPanels: false
	  , showBreadCrumbs: false
	  , maxNumberOfExecutionTabs: 1 //the maximum number of tabs to open on execution of documents if valorized
	  , typeLayout: 'card' //possible values: 'tab' or 'card'
	  , showTitle: false
	  , hideGoBackToolbar: true
	  , showCreateButton: false
}; 



Sbi.settings = Ext.apply(Sbi.settings,Sbi.settings.geobi);


