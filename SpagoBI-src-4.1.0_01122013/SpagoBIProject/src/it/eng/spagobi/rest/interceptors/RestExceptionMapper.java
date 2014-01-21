/* SpagoBI, the Open Source Business Intelligence suite

 * Copyright (C) 2012 Engineering Ingegneria Informatica S.p.A. - SpagoBI Competency Center
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0, without the "Incompatible With Secondary Licenses" notice. 
 * If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/. */

package it.eng.spagobi.rest.interceptors;

import it.eng.spago.security.IEngUserProfile;
import it.eng.spagobi.commons.bo.UserProfile;
import it.eng.spagobi.commons.constants.SpagoBIConstants;
import it.eng.spagobi.commons.utilities.AuditLogUtilities;
import it.eng.spagobi.commons.utilities.ChannelUtilities;
import it.eng.spagobi.services.exceptions.ExceptionUtilities;

import java.net.URI;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import org.apache.log4j.Logger;
import org.jboss.resteasy.core.Dispatcher;
import org.jboss.resteasy.mock.MockDispatcherFactory;
import org.jboss.resteasy.spi.HttpRequest;
import org.jboss.resteasy.spi.HttpResponse;
import org.jboss.resteasy.spi.LoggableFailure;

/**
 * 
 * @author Alberto Ghedin (alberto.ghedin@eng.it)
 *
 * Updates the audit log for the services that throw exceptions
 *
 */

@Provider
public class RestExceptionMapper implements ExceptionMapper<Throwable>
{

	static private Logger logger = Logger.getLogger(RestExceptionMapper.class);
	
	@Context
	private HttpRequest request;
	@Context
	private HttpResponse httpresponse;
	@Context
	private HttpServletRequest servletRequest;
	@Context
	private HttpServletResponse servletResponse;
	
	public Response toResponse(Throwable e) {
		logger.debug("RestExceptionMapper:toResponse IN");
		String ex = "Service Exception";
		try {
			String serviceUrl = InterceptorUtilities.getServiceUrl(request);
			//checks for LoggableFailure excepyion (with userId info)
			if(e instanceof LoggableFailure){
				//missing authentication --> go to login page
			      {
			    	 logger.debug("Missing authentication");
			    	 String url = createUrl(request, servletRequest);
			         return Response.status(302).location(URI.create(url)).build();

			      }
				
			}

			HashMap<String,String> parameters = InterceptorUtilities.getRequestParameters(request, servletRequest);
			ex = ExceptionUtilities.serializeException(e.getMessage(),null);
			parameters.put("Exception", ex);
					
			UserProfile profile = (UserProfile) servletRequest.getSession().getAttribute(IEngUserProfile.ENG_USER_PROFILE);
				
			String actionCode = "[Service:"+ serviceUrl+"]";
			String result ="";

			AuditLogUtilities.updateAudit(servletRequest, profile, actionCode,	parameters, "ERR");
		} catch (Exception e2) {
			String serviceUrl = InterceptorUtilities.getServiceUrl(request);
			logger.error("Error in the service "+serviceUrl);
		}
		logger.error("Application Error",e);
		
		Response response =  Response.status(500).entity(ex).build();
		logger.debug("RestExceptionMapper:toResponse OUT");
		
		return response;
	}
	
	private String createUrl (HttpRequest request, HttpServletRequest servletRequest){
        String contextName = ChannelUtilities.getSpagoBIContextName(servletRequest);
        String addr= servletRequest.getServerName();
        Integer port=servletRequest.getServerPort();
        String proto =servletRequest.getScheme();
        String backUrl= request.getUri().getRequestUri().getPath();
        String community= (String)servletRequest.getParameter("community");
        String owner= (String)servletRequest.getParameter("owner");
        String userToAccept= (String)servletRequest.getParameter("userToAccept");
        String url= proto+"://"+addr+":"+port+""+contextName+"/servlet/AdapterHTTP?PAGE=LoginPage&NEW_SESSION=TRUE&"+SpagoBIConstants.BACK_URL+"="+backUrl
       		 +"&community="+community+"&owner="+owner+"&userToAccept="+userToAccept;
        return url;
		
	}


}
