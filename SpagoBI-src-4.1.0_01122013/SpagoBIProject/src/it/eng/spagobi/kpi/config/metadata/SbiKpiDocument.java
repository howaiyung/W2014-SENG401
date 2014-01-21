/* SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. */
package it.eng.spagobi.kpi.config.metadata;

import it.eng.spagobi.analiticalmodel.document.metadata.SbiObjects;
import it.eng.spagobi.commons.metadata.SbiHibernateModel;



/**
 * SbiKpiRole generated by hbm2java
 */

public class SbiKpiDocument  extends SbiHibernateModel{

	// Fields    
	
    private Integer idKpiDoc;
    private SbiKpi sbiKpi;
    private SbiObjects sbiObjects;


   // Constructors

   /** default constructor */
   public SbiKpiDocument() {
	   this.idKpiDoc = -1;
   }

   
   /** full constructor */
   public SbiKpiDocument(Integer idKpiDoc, SbiKpi sbiKpi, SbiObjects sbiObjects) {
       this.idKpiDoc = idKpiDoc;
       this.sbiKpi = sbiKpi;
       this.sbiObjects = sbiObjects;
   }

  
   // Property accessors

   // Property accessors

   public Integer getIdKpiDoc() {
       return this.idKpiDoc;
   }
   
   public void setIdKpiDoc(Integer idKpiDoc) {
       this.idKpiDoc = idKpiDoc;
   }

   public SbiObjects getSbiObjects() {
       return this.sbiObjects;
   }
   
   public void setSbiObjects(SbiObjects sbiObjects) {
       this.sbiObjects = sbiObjects;
   }

   public SbiKpi getSbiKpi() {
       return this.sbiKpi;
   }
   
   public void setSbiKpi(SbiKpi sbiKpi) {
       this.sbiKpi = sbiKpi;
   }

}