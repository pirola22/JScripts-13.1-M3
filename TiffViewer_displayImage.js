/**
 * This script shows a preview of the ADC file and creates a new button for openning the file in a new window
 * This is for APS112/H only 
 *
 * Requirements: Proper DAF environment
 *
 * Revisions:
 *		Version 1.0.0: 07112007 
 *			- Imported from 6.0 SP1
 *		Version 1.0.1: 01262012
 *			- add handling for DAF link ("daf") in function Init() to load preview image
 *			- add new function CheckFolder() to check if ADC folder exists, otherwise create it
 *			- Update OnClick event to handle DAF links to load image in a new window
 *			- Add new function GetPid() that retrieves the PID using the path (WWPATH) for DAF protocol
 *		Version 1.0.2: 03062012
 *			- update checking of DAF link to use case insensitive comparison
 *			- added documentation
 *			- add new function LoadStreamFile() to load file to MemoryStream using PID
 *			- add new function IsDafProtocol() to check path/link is DAF
 *		Version 1.0.3: 03222012
 *			- add support to handle "daf" or "mdas" prefix
 *			- modified IsDafProtocol to check for "daf" and "mdas" prefix
 *			- add new function GetDafPrefix() to get the prefix used in the document path
 *			- add new function GetDafPrefix() to get the prefix used in the document path
 *			- add new parameter to GetPid() for parsing the correct prefix
 *		Version 1.0.4: 04172012
 *			- replace stackpanel in preview image with grid
 *			- smoothen preview image with DecodePixelWidth (set to parent element's width)
 *			- add scroll viewer to the image control
 *		Version 1.0.5: 03152013
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
	class TiffViewer_displayImage 
	{
		var path : String = null;
		var xquery, filename;
		var debug : Object;
		var strMDASProtocol = "daf";
		var strDafPrefixes = ["daf", "mdas"]

		/* Function is used to add a button(Open in new window) and an image preview of the ADC file
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
			var content : Object = controller.RenderEngine.Content;
			this.debug = debug;
			var pathElement;
			var messageElement;

			pathElement = ScriptUtil.FindChild(content, "WWPATH");
			messageElement = ScriptUtil.FindChild(content, "WHBMSG");

			if(pathElement == null || messageElement == null) 
			{
				debug.WriteLine("Could not find WWPATH or WHBMSG");
				return;
			}

			path = pathElement.Text;
			var buttonText : String = messageElement.Text;

			 //debug.WriteLine("WWPATH=" + path);
			 //debug.WriteLine("WHBMSG=" + buttonText);

            var grid : Grid = new Grid();
            var rd : RowDefinition = new RowDefinition();
            rd.Height = GridLength.Auto;
            
            grid.RowDefinitions.Add(rd);
            grid.RowDefinitions.Add(new RowDefinition());
			var b : Button = new Button();
			b.Content = buttonText;
			b.HorizontalAlignment = HorizontalAlignment.Left;
			b.VerticalAlignment = VerticalAlignment.Top;
			b.Width = 140;
			b.Margin = new Thickness(0,0,0,10);
            grid.Children.Add(b);
	
            var parentColumnSpan = Grid.GetColumnSpan(element);
            var parentColumnWidth = (parentColumnSpan * Configuration.CellWidth) - 16;

			// Check if this i a DAF link. If so then parse the url and change it
			//if(path.StartsWith(strMDASProtocol, StringComparison.CurrentCultureIgnoreCase)) 
			if (IsDafProtocol(path))
			{
				var pid = GetPid(GetDafPrefix(path));
				if(pid != null)
				{	
					// Create the thumbnail
					var outStream : MemoryStream = new MemoryStream();
					
					if (!LoadStreamFile(pid, outStream))
						return;
					
					//This might only work when it's an image, not pdf
					if(!filename.EndsWith(".pdf", StringComparison.CurrentCultureIgnoreCase))
					{
						var image : Image = new Image();
						image.Stretch = Stretch.Uniform;
						var bi : BitmapImage = new BitmapImage();

						bi.BeginInit();
						bi.StreamSource = outStream;
						bi.DecodePixelWidth = parentColumnWidth;
						bi.EndInit();

						// Populate the image place  holder
						image.Source = bi;
						
                        // add ScrollViewer
                        var scrl = new ScrollViewer();
                        scrl.Content = image;
                        Grid.SetRow(scrl, 1);
						//stack.Children.Add(image);					
                        grid.Children.Add(scrl);
					}											
				}
			}
			else
			{
				if(path.EndsWith(".tif", StringComparison.CurrentCultureIgnoreCase) || path.EndsWith(".tiff", StringComparison.CurrentCultureIgnoreCase)) 			
				{
					var bid : BitmapImage = new BitmapImage();
					var img : Image = new Image();
					bid.BeginInit();
					bid.UriSource = new Uri(path,UriKind.RelativeOrAbsolute);
					bid.DecodePixelWidth = parentColumnWidth;
					bid.EndInit();
					img.Source = bid;
					
                    // add ScrollViewer
                    var scrl = new ScrollViewer();
                    scrl.Content = image;
                    Grid.SetRow(scrl, 1);
                    grid.Children.Add(scrl);
				}
			}
			
			element.Children.Add(grid);
			debug.WriteLine("Parent Element Width = " + element.ActualWidth);
			b.add_Click(OnClick);		
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
		 * 	For DAF links, a file is created on local file system based on PID and is launched on a new window
		 * 	For non-DAF, the path is launched on a new window
		 * Parameters:
		 * 		sender	: Object
		 * 		e		: RoutedEventArgs
		 * 	Return Values:
		 * 		None
		 */
		public function OnClick(sender: Object, e: RoutedEventArgs) 
		{
			pid = "";	

			//If protocol is DAF
			if(IsDafProtocol(path)) 
			{
				var pid = GetPid(GetDafPrefix(path));
				if(pid != null)
				{
					// Create the thumbnail
					var outStream : MemoryStream = new MemoryStream();
	
					if(!LoadStreamFile(pid, outStream))
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
			}
			else
			{
				if(!String.IsNullOrEmpty(path)) 
				{
					ScriptUtil.Launch(path);
				} 
				else 
				{
					ConfirmDialog.ShowErrorDialogWithoutCancel("Empty or missing url", "MvxImgDsp_DspInvImage.OnClick: Empty or missing url.");	
					debug.WriteLine("MvxImgDsp_DspInvImage.OnClick: Empty or missing url.");
				}
			}
		}

		/*
		 * Retrieves the Pid using the member variable path(WWPATH) and method APIs.SearchItems()
		 * Parameters:
		 * 		strPrefix  : String 	
		 * 	Return Values:
		 * 		String/Null - returns the PID as string
		 * 					- returns null if there is no PID
		 */
		public function GetPid(strPrefix: String)
		{		
			var arrOldUrl : Object = path.substr(strPrefix.length).split("\\");
			
			// ADCSupInv[@ADCYear = 2011 AND @ADCMonth = 08 AND @ADCDay = 22 AND @ADCFileName = "filename.tif"]
			filename =  arrOldUrl[arrOldUrl.length - 1];
			xquery = "/ADCSupInv[@ADCYear = " + arrOldUrl[arrOldUrl.length - 3]; /* ADC YEAR */
			xquery+= " AND @ADCMonth = " + arrOldUrl[arrOldUrl.length - 2]; /* ADC MONTH */
			xquery+= " AND @ADCFileName = \"" + filename + "\"]"; /* ADC FILENAME */				

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