import System;
import System.Collections;
import System.Windows.Controls;
import System.Windows.Input;
import System.Windows.Media;
import Lawson.M3.MI;
import Mango.UI.Services.Lists;
import MForms;
import System.Windows.Threading;
import Mango.UI.Services;
import Mango.Core.Util;
import Mango.UI.Utils;
package MForms.JScript {
	class LeadFilter {
		var listView;
		
		//Set globals here
		var controller;
		var content;
		  var rowCount = 0;
		var debug : Object;
		var rows : IList;
		var columns : System.Windows.Controls.GridViewColumnCollection;
		var scrollViewer : System.Windows.Controls.ScrollViewer;
		var oldCount : Double = 0,
		newCount : Double = 0;
		var listControl;
		var columnIndex;
		var curCount = 0;
		var isPaging;
		 var currentRowCount;
		 var plgrValue = "";
		public function Init(element : Object, args : Object, controller : Object, debug : Object) {
			try {
				this.controller = controller;
				this.content = controller.RenderEngine.Content;
				this.debug = debug;
				 this.isPaging = false;
				//theses 2 lines make the script wait until content is loaded
				var startDelegate : Action = MyStart;
				content.Dispatcher.BeginInvoke(DispatcherPriority.Background, startDelegate);
				// include both lines in every script
			} catch (ex : Exception) {
				debug.WriteLine(ex);
			}
		}
		function MyStart() {
			try {
				  plgrValue = ScriptUtil.FindChild(content, "WWPLGR").Text;
				 
				 if(plgrValue == "QCLEAD"){	
				listControl = controller.RenderEngine.ListControl;
				 
				//populate list view
				this.listView = controller.RenderEngine.ListControl.ListView;
				this.rows = listView.Items;
				this.columns = listView.View.Columns;
				//end populate list view
				//add column
				var gvch = new GridViewColumnHeader();
				currentRowCount = rows.Count;
				var gvc = new GridViewColumn();
				gvc.Header = gvch;
				gvc.CellTemplateSelector = new ListCellTemplateSelector(columns.Count, controller.RenderEngine.ListControl.Columns);
				columns.Add(gvc);
				//add column
				if (listView.ItemsSource != null) {
				
					rows = IList(listView.ItemsSource); // Use the ItemsSource to get data
				} else {
					rows = listView.Items; //Get the items
				}
				// logic
				 // check text in wrk center
				   plgrValue = ScriptUtil.FindChild(content, "WWPLGR").Text;
				 
				 if(plgrValue == "QCLEAD"){				 
				 var rowCount = 0;	
				 var orginCount = rows.Count;
				 while(orginCount >= rowCount ){
					filter(rowCount - curCount, 'WHST');
					rowCount++;
				 }			 
				 }
			 
					var typeScrollViewer : Type = Type.GetType("System.Windows.Controls.ScrollViewer, PresentationFramework, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35");
			scrollViewer = Helpers.FindElementOfType(listControl.ListView, typeScrollViewer);
				if (scrollViewer != null) {
			this.scrollViewer.add_ScrollChanged(OnScrollChanged);
			}
				
				 controller.add_Requested(OnRequested);
				controller.add_RequestCompleted(OnRequestCompleted);
				listView.Items.Refresh();
			}
			} catch (ex : Exception) {
				debug.WriteLine(ex);
			}
		} 
		
		function filter(rowNum, field) {
			try {
				listControl = controller.RenderEngine.ListControl;
				columnIndex = listControl.GetColumnIndexByName(field);
				var row = listView.Items[rowNum];
					var whst = row[columnIndex];
					if (whst == 20) {
						 rows.RemoveAt(rowNum);
						 curCount++;
		 
					}else{
						var newItems = new String[row.Items.length + 1];
						row.Items.CopyTo(newItems, 0);						
					} 
					row.Items = newItems;
			} catch (ex) {}
		}
	
			function OnScrollChanged(sender : Object, e : ScrollChangedEventArgs) {
				if (e.VerticalChange != 0) {
					oldCount = listView.Items.Count;
				} else {
					var newCount = listView.Items.Count;
					var diff : int = newCount - oldCount;
					var fromRow = oldCount;
					var toRow = listView.Items.Count - 1;
					if (diff > 0) {
                // filter(fromRow, rows.Count - 1, 'WHST');var rowCount = 0;
                var orginCount = rows.Count;
                rowCount = rowCount - curCount;
                while (rowCount <= newCount) {
                    filter(rowCount, 'WHST');
                    rowCount++;
                }
            }
					
				}
			}
       public function OnRequested(sender: Object, e: RequestEventArgs)
      {
         try
         {
            debug.WriteLine("Page down onrequested "+e.CommandType);
            if(e.CommandType == "PAGE" && e.CommandValue == "DOWN")
            {
               // Do not disconnect events on page down.
               debug.WriteLine("Page down request");
               return;
            }
 
            // Remove all event handlers.
            debug.WriteLine("Request executed, removing event handlers.");
            controller.remove_Requested(OnRequested);
            controller.remove_RequestCompleted(OnRequestCompleted);
         }
         catch(ex)
         {
            debug.WriteLine(ex);
         }
      }
			function OnRequestCompleted(sender : Object, e : RequestEventArgs) {
				     try
         {
            if(e.CommandType == "PAGE" && e.CommandValue == "DOWN")
            {
               // Page down complete, try to update list rows again.
              // UpdateRows();
            }
         }
         catch(ex)
         {
            debug.WriteLine(ex);
         }
				try {
					var controller : MForms.InstanceController = sender;
					if (controller.RenderEngine == null) {
						var controller;
						content = null;
						debug = null;
						rows = null;
						columns = null;
						
						oldCount = 0,
						newCount = 0;
						listControl = null;
						columnIndex = null;
						// program is closing, cleanup
						//remove any objects
						scrollViewer.remove_ScrollChanged(OnScrollChanged);
						controller.remove_RequestCompleted(OnRequestCompleted);
					}
				} catch (ex : Exception) {
					debug.WriteLine(ex);
				}
			}
		}
	}
