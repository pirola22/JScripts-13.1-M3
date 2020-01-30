/**
 * Shows the ADC file. Opens a file in a new window.
 * Use the application "CRS084" to change the server url.
 * To use the Document Archive, just create a post in "CRS084" with the server name "daf"
 * The url looks like this: "\\<server>\<optional folders>\<year>\<month>\<filename>"
 * @param arg String. Name of the field that holds the ADC url (usually WWPATH).
 * 
 * Requirements: Proper DAF environment
 *  
 * Revisions:
 *		Version 1.0.0: 07112007 
 *			- Imported from 6.0 SP1
 *		Version 1.0.1: 08232007
 *			- Added correct support for the document archive in LSC
 *			- Modified "http" to "mbrix" in url for MDASProtocol
 *		Version 1.0.2: 09072010
 *			- subscribe to Requested event on controller
 *			- Moved button.remove_Click() from button.OnUnloaded() to controller.OnRequested() event
 *		Version 1.0.3: 01262012
 *			- add new function CheckFolder() to check if ADC folder exists, otherwise create it
 *			- Add new function GetPid() that retrieves the Pid using the path
 *			- Modified MDASProtocol from "mbrix" to "daf"
 *			- Update OnClick event to load image using PID for DAF and to launch the url for non-DAF
 *		Version 1.0.4: 03062012
 *			- update checking of DAF link to use case insensitive comparison
 *			- added documentation
 *			- add new function LoadStreamFile() to load file to MemoryStream using PID
 *			- add new function IsDafProtocol() to check path/link is DAF
 *		Version 1.0.5: 03222012
 *			- add support to handle "daf" or "mdas" prefix
 *			- modified IsDafProtocol to check for "daf" and "mdas" prefix
 *			- add new function GetDafPrefix() to get the prefix used in the document path
 *			- add new parameter to GetPid() for parsing the correct prefix
 *		Version 1.0.6: 03152013
 *			- updated CheckFolder() to use backslashes instead of forwardslash for creating path
 */
 
import System;
import System.Windows;
import System.Windows.Controls;
import System.Windows.Documents;
import MForms;
import Mango.Services;
import Mango.UI.Services;
import Mango.UI;
import Mango.UI.Controls;
import System.Xml;
import System.Windows.Media.Imaging;
import System.IO;
import System.Windows.Media;
import DocumentArchive.Core;

package MForms.JScript 
{
	class MvxImgDsp_DspInvImage 
	{
		var fieldName : Object;
		var controller : Object;
		var debug : Object;
		var button;
		var element, content, link, label, xquery, columns, resolver, pid, url, filename;
		var strDafPrefixes = ["daf", "mdas"]
		
		/* Function is used to subscribe to element's Click event
		 * Parameters:
		 * 		element 	: Object
		 * 		args 		: Object
		 * 		controller 	: Object
		 * 		debug 		: Object
		 * 	Return Value:
		 * 		None
		 */
		public function Init(element: Object, args: Object, controller : Object, debug : Object) 
		{
			fieldName = args;
			this.controller = controller;
			this.debug = debug;
			button = element;
			button.add_Click(OnClick);
			controller.add_Requested(OnRequested);
		}

		/* Function used to handle the controller's Requested event
		 * Parameters:
		 * 		sender	 	: Object
		 * 		e 			: RequestEventArgs
		 * 	Return Value:
		 * 		None
		 */
		public function OnRequested(sender : Object, e : RequestEventArgs)
		{      	
			controller.remove_Requested(OnRequested);    
			button.remove_Click(OnClick);
		}  
		
		/* 
		 * Function to check if ADC folder exists, otherwise create it
		 * Parameters:
		 * 		None
		 * 	Return Values:
		 * 		Bool/String - returns false if it fails to create a folder
		 * 					- returns the ADC directory path 
		 */
		function CheckFolder()
		{				
			var wshell = new ActiveXObject("WScript.Shell");    
			var tempfolder = wshell.ExpandEnvironmentStrings("%TEMP%");    	    
			var path = tempfolder+"\\";
			var fsobject;
			fsobject = new ActiveXObject("Scripting.FileSystemObject");
			if(fsobject.FolderExists(tempfolder+"\\Lawson\\DocumentArchive\\ADC\\"))
			{
				//ADC temp folder already exists
				return tempfolder+"\\Lawson\\DocumentArchive\\ADC\\";
			}
			
			//Create sub path for ADC temp folder
			var folderarray = new Array();
			folderarray[0] = "Lawson";
			folderarray[1] = "DocumentArchive";
			folderarray[2] = "ADC";
			 
			var i;
			for(i=0;i<folderarray.length; i++)
			{
				path+=folderarray[i]+"\\";
				try
				{
					if(!fsobject.FolderExists(path))
					{
						debug.WriteLine(path);        
						fsobject.CreateFolder(path);
					}    
				}
				catch(ex)
				{
					ConfirmDialog.ShowErrorDialogWithoutCancel("Exception thrown during ADC temp folder creation", ex.ToString());			
					debug.WriteLine("Exception thrown during ADC temp folder creation");
					return false;
				}
			}
			debug.WriteLine("Path: "+path);
			return path;
		}

		/*
		 * Handles the button's Click event
		 * 	For DAF urls, a file is created on local file system using the PID and is launched
		 * 	For non-DAF, the url is launched
		 * Parameters:
		 * 		sender	: Object
		 * 		e		: RoutedEventArgs
		 * 	Return Values:
		 * 		None
		 */
		public function OnClick(sender: Object, e: RoutedEventArgs) 
		{
			var content : Object = controller.RenderEngine.Content;
			var hiddenField : Object = ScriptUtil.FindChild(content, fieldName);
			if(hiddenField == null) 
			{	
				debug.WriteLine("MvxImgDsp_DspInvImage.OnClick: " + fieldName + " is missing.");
				ConfirmDialog.ShowErrorDialogWithoutCancel("Missing field", "MvxImgDsp_DspInvImage.OnClick: " + fieldName + " is missing.");				
				return;
			}
			
			pid = "";	
			
			//If protocol is DAF
			url = hiddenField.Text;		
			if(IsDafProtocol(url)) 
			{
				var pid = GetPid(GetDafPrefix(url));
				if(pid != null)
				{		
					// Create the thumbnail
					var outStream : MemoryStream = new MemoryStream();
		
					if (!LoadStreamFile(pid, outStream))
						return;
					
					try
					{
						var imagepath = CheckFolder(); //Checks if folder exists, otherwise create
						if(imagepath != false)
						{
							//Creates filestream
							imagepath += filename;
							var filestream : Stream = new FileStream(imagepath, FileMode.Create);

							var bw : BinaryWriter = new BinaryWriter(filestream); 
							bw.Write(outStream.ToArray());
							bw.Close();
							filestream.Close();
							ScriptUtil.Launch(imagepath);
						}
						else
						{
							ConfirmDialog.ShowErrorDialogWithoutCancel("Temp Folder Not Created", "Was not able to create temp folder");
							debug.WriteLine("Was not able to create temp folder");
						}						
					}
					catch(ex)
					{
						debug.WriteLine(ex.ToString());
						ConfirmDialog.ShowErrorDialogWithoutCancel("An Error occured", ex.ToString());
					}							
					
				}
				else
				{
					ConfirmDialog.ShowErrorDialogWithoutCancel("Pid is null", "Could not find the pid code for this image");
				}
			}
			else
			{
				if(!String.IsNullOrEmpty(url)) 
				{
					ScriptUtil.Launch(url);
				} 
				else 
				{
					ConfirmDialog.ShowErrorDialogWithoutCancel("No Image", "No invoice image is connected to this invoice");					
					debug.WriteLine("MvxImgDsp_DspInvImage.OnClick: Empty or missing url.");
				}
			}
		}
		
		/*
		 * Retrieves the Pid using the url
		 * Parameters:
		 * 		strPrefix	:	String 	
		 * 	Return Values:
		 * 		String/Null - returns the PID as string
		 * 					- returns null if there is no PID
		 */
		public function GetPid(strPrefix: String)
		{		
			var arrOldUrl : Object = url.substr(strPrefix.length).split("\\");
			// ADCSupInv[@ADCYear = 2011 AND @ADCMonth = 08 AND @ADCDay = 22 AND @ADCFileName = "filename.tif"]		
			filename =  arrOldUrl[arrOldUrl.length - 1];
			xquery = "/ADCSupInv[@ADCYear = " + arrOldUrl[arrOldUrl.length - 3]; 	/* ADC YEAR */
			xquery+= " AND @ADCMonth = " + arrOldUrl[arrOldUrl.length - 2]; 		/* ADC MONTH */
			xquery+= " AND @ADCFileName = \"" + filename + "\"]"; 					/* ADC FILENAME */				

			var xmldoc : XmlDocument = APIs.SearchItems("QK_xquery=" + xquery, 0, 1, false);
			// Select the document id node
			var itemNode : XmlNode = xmldoc.SelectSingleNode("/items/item");  				
			if (itemNode != null) 
			{
				var mainNode = XmlHelper.GetResourceMainNode(itemNode);
				if(mainNode != null)
				{
					return XmlHelper.GetPid(mainNode);				
				}
			}
			return null;
		}	
		
		/*
		 * Check if url is DAF/MDAS Protocol
		 * Parameters:
		 * 		strUrl	:String 
		 * 	Return Values:
		 * 		Boolean - returns true if url starts with "daf"
		 */
		function IsDafProtocol(strUrl: String)
		{
			for (var i=0;i <strDafPrefixes.length; i++)
			{
				if (strUrl.StartsWith(strDafPrefixes[i], StringComparison.CurrentCultureIgnoreCase))
					return true;
			}
			return false;
			//return strUrl.StartsWith(strMDASProtocol, StringComparison.CurrentCultureIgnoreCase);
		}

		/*
		 * Retrieve the string prefix used in the url
		 * Parameters:
		 * 		strUrl	:String 
		 * 	Return Values:
		 * 		String - returns "daf" or "mdas" based on the url
		 * 				- returns "" 
		 */
		function GetDafPrefix(strUrl: String)
		{
			for (var i=0;i <strDafPrefixes.length; i++)
			{
				if (strUrl.StartsWith(strDafPrefixes[i], StringComparison.CurrentCultureIgnoreCase))
					return strDafPrefixes[i];
			}
			return "";
		}
		
		/*
		 * Loads file to outStream using the PID
		 * Parameters:
		 * 		strPid	:String 
		 * 		outStream	:MemoryStream
		 * 	Return Values:
		 * 		Boolean - returns true if file is successfully loaded to outSteam
		 * 				- returns false if not
		 */
		function LoadStreamFile(strPid: String, outStream: MemoryStream)
		{
			try 
			{
				APIs.StreamResourceFile(strPid, outStream);
				outStream.Position = 0;
			} 
			catch (err) 
			{
				ConfirmDialog.ShowErrorDialogWithoutCancel("Failed to get url for invoice image. Please check the error logs on the Document Archive Server.");   				
				debug.WriteLine("StreamResource failed");
				return false;
			}
			return true;
		}
	}
}