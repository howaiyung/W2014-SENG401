/* SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. */
package it.eng.spagobi.tools.objmetadata.metadata;
// Generated 18-nov-2009 17.58.50 by Hibernate Tools 3.1.0 beta3

import it.eng.spagobi.analiticalmodel.document.metadata.SbiObjects;
import it.eng.spagobi.analiticalmodel.document.metadata.SbiSubObjects;
import it.eng.spagobi.commons.metadata.SbiBinContents;
import it.eng.spagobi.commons.metadata.SbiHibernateModel;

import java.util.Date;




/**
 * SbiObjMetacontents generated by hbm2java
 */

public class SbiObjMetacontents  extends SbiHibernateModel {

	// Fields    

    private Integer objMetacontentId;
    private SbiObjects sbiObjects;
    private SbiSubObjects sbiSubObjects;
    private SbiBinContents sbiBinContents;
    private Integer objmetaId;
    private Date creationDate;
    private Date lastChangeDate;


   // Constructors

   /** default constructor */
   public SbiObjMetacontents() {
   }

	/** minimal constructor */
   public SbiObjMetacontents(Integer objMetacontentId, SbiObjects sbiObjects, Integer objmetaId, Date creationDate, Date lastChangeDate) {
       this.objMetacontentId = objMetacontentId;
       this.sbiObjects = sbiObjects;
       this.objmetaId = objmetaId;
       this.creationDate = creationDate;
       this.lastChangeDate = lastChangeDate;
   }
   
   /** full constructor */
   public SbiObjMetacontents(Integer objMetacontentId, SbiObjects sbiObjects, SbiSubObjects sbiSubObjects, SbiBinContents sbiBinContents, Integer objmetaId, Date creationDate, Date lastChangeDate) {
       this.objMetacontentId = objMetacontentId;
       this.sbiObjects = sbiObjects;
       this.sbiSubObjects = sbiSubObjects;
       this.sbiBinContents = sbiBinContents;
       this.objmetaId = objmetaId;
       this.creationDate = creationDate;
       this.lastChangeDate = lastChangeDate;
   }
   

  
   // Property accessors

   public Integer getObjMetacontentId() {
       return this.objMetacontentId;
   }
   
   public void setObjMetacontentId(Integer objMetacontentId) {
       this.objMetacontentId = objMetacontentId;
   }

   public SbiObjects getSbiObjects() {
       return this.sbiObjects;
   }
   
   public void setSbiObjects(SbiObjects sbiObjects) {
       this.sbiObjects = sbiObjects;
   }

   public SbiSubObjects getSbiSubObjects() {
       return this.sbiSubObjects;
   }
   
   public void setSbiSubObjects(SbiSubObjects sbiSubObjects) {
       this.sbiSubObjects = sbiSubObjects;
   }

   public SbiBinContents getSbiBinContents() {
       return this.sbiBinContents;
   }
   
   public void setSbiBinContents(SbiBinContents sbiBinContents) {
       this.sbiBinContents = sbiBinContents;
   }

   public Integer getObjmetaId() {
       return this.objmetaId;
   }
   
   public void setObjmetaId(Integer objmetaId) {
       this.objmetaId = objmetaId;
   }

   public Date getCreationDate() {
       return this.creationDate;
   }
   
   public void setCreationDate(Date creationDate) {
       this.creationDate = creationDate;
   }

   public Date getLastChangeDate() {
       return this.lastChangeDate;
   }
   
   public void setLastChangeDate(Date lastChangeDate) {
       this.lastChangeDate = lastChangeDate;
   }
  
}
