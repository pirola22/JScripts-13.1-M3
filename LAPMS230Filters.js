import System;
import System.Windows;
import System.Windows.Controls;import System.Windows.Controls;
import System.Windows.Input;
import System.Windows.Media;
import Lawson.M3.MI;
import Mango.UI.Services.Lists;
import System.Windows.Threading;
import Mango.UI.Services;
import Mango.Core.Util;
import MForms;
import Mango.UI.Utils;
import System.Collections; 
package MForms.JScript {
   class LAPMS230Filters {
      var logger: log4net.ILog = Mango.Core.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType)
      var controller, debug, content;
      var currentRowCount;
      var isPaging;
	  var rowsLoaded: Boolean = false;
		  var rowCount = 0;
		var columns : System.Windows.Controls.GridViewColumnCollection;
		var scrollViewer : System.Windows.Controls.ScrollViewer;
		var oldCount : Double = 0,
		newCount : Double = 0;
		var listControl;
		var columnIndex;
		var curCount = 0;
	 	var listView;
		var rows : IList;  
		 var plgrValue = "";
		 var whloFilter: Boolean = false;
		 var whstFilter: Boolean = false;
      public function Init(element: Object, args: Object, controller : Object, debug : Object) {
        try
         {
            //LogDebug("Initializing script"); 
            this.controller = controller;
            this.debug = debug;
            this.content = controller.RenderEngine.Content;
            this.isPaging = false; 
            // Attach event handlers to be able to detach event handlers and list to page down requests.
            controller.add_Requested(OnRequested);
            controller.add_RequestCompleted(OnRequestCompleted);
			//getting items
            var items = controller.RenderEngine.ListControl.ListView.Items;
            currentRowCount = items.Count;
            LogDebug("currentRowCount in init "+ currentRowCount);
            if(currentRowCount == 33){
                LogDebug("Dispaching with BeginInvoke");
                //PageDownInList();
                var pageDownDelegate: VoidDelegate = PageDownInList;
                content.Dispatcher.BeginInvoke(DispatcherPriority.Background, pageDownDelegate);
                return;
            }
			
         }
         catch(ex)
         {
           LogDebug("Exception in init");
           LogDebug(ex.ToString());
         }
      }
 
	 
    private function PageDownInList(){
        LogDebug("Before page down");
        isPaging = true;
        controller.PageDown();
      }
	function StartWHLOFilter () {
		  			try {
				  plgrValue = ScriptUtil.FindChild(content, "WWPLGR").Text;
				 
				 if(plgrValue == "QCLEAD"){	
				listControl = controller.RenderEngine.ListControl;
				 
				//populate list view
				this.listView = controller.RenderEngine.ListControl.ListView;
				this.rows = listView.Items;
				currentRowCount = rows.Count;

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
					filterWHLO(rowCount - curCount, 'WHLO');
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
	function StartWHSTFilter () {
		  			try {
				  plgrValue = ScriptUtil.FindChild(content, "WWPLGR").Text;
				 
				 if(plgrValue == "QCLEAD"){	
				listControl = controller.RenderEngine.ListControl;
				 
				//populate list view
				this.listView = controller.RenderEngine.ListControl.ListView;
				this.rows = listView.Items;
				currentRowCount = rows.Count;
	 
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
					filterWHST(rowCount - curCount, 'WHST');
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
	  
	function filterWHST(rowNum, field) {
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

	function filterWHLO(rowNum, field) {
			try {
				listControl = controller.RenderEngine.ListControl;
				columnIndex = listControl.GetColumnIndexByName(field);
			var	whloColumnIndex = listControl.GetColumnIndexByName('WHLO');
				var row = listView.Items[rowNum];
					var whst = row[columnIndex];
					var whlo = row[whloColumnIndex];
					if (whst == 20) {
						 rows.RemoveAt(rowNum);
						 curCount++;
		 
					}else{
						var newItems = new String[row.Items.length + 1];
						row.Items.CopyTo(newItems, 0);						
					} 
						if (whst == '61E') {
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
                var orginCount = rows.Count;
                rowCount = rowCount - curCount;
                while (rowCount <= newCount) {
                    filterWHST(rowCount, 'WHST');
                    rowCount++;
            }
        }
	}
}
 //************************************************************************************	
      private function LogError(message: String, exception: Exception){
       debug.WriteLine(message);
       if(exception!=null){
         logger.Error(message, exception);
       }else{
        logger.Error(message);
       }
 
      }
 
      private function LogDebug(message: String){
      if(message!= null){
         logger.Debug(message);
         if(debug){
           debug.WriteLine(message);
         }
       }
      }
 
      public function UpdateRows(){
         var items = controller.RenderEngine.ListControl.ListView.Items;
         var delta = items.Count - currentRowCount;
         LogDebug("Delta "+ delta);
 
           // Check if we can load more rows
            var hasMoreRows = (delta == 33);
 
            if(hasMoreRows)
            {
               // Not enough rows, load more.
               LogDebug("Loading more list rows");
               currentRowCount = items.Count;
               LogDebug("currentRowCount "+ currentRowCount);
 
               isPaging = true;
               controller.PageDown();
               return;
            }
            else
            {
               LogDebug("No more rows to load");
			   rowsLoaded = true;
			//After all rows are loaded start to filter
			  StartWHLOFilter();
			  StartWHSTFilter();
            }
 
         LogDebug("Updating items" );
 
      }
 
       public function OnRequested(sender: Object, e: RequestEventArgs)
      {
         try
         {
            LogDebug("Page down onrequested "+e.CommandType);
            if(e.CommandType == "PAGE" && e.CommandValue == "DOWN")
            {
               // Do not disconnect events on page down.
               LogDebug("Page down request");
               return;
            }
 
            // Remove all event handlers.
            LogDebug("Request executed, removing event handlers.");
            controller.remove_Requested(OnRequested);
            controller.remove_RequestCompleted(OnRequestCompleted);
         }
         catch(ex)
         {
            LogDebug(ex);
		 
         }
      }
 
       public function OnRequestCompleted(sender: Object, e: RequestEventArgs)
      {
         try
         {
            if(e.CommandType == "PAGE" && e.CommandValue == "DOWN")
            {
               // Page down complete, try to update list rows again.
               UpdateRows();
            }
         }
         catch(ex)
         {
            debug.WriteLine(ex);
         }
      }
	  
	  
 
   }
   

}