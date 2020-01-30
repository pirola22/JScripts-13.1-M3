import System;
import System.Windows;
import System.Windows.Controls;
import System.Windows.Threading;
import Mango.UI.Services;
import Mango.Core.Util;
import MForms;
 
package MForms.JScript {
   class PageDown {
      var logger: log4net.ILog = Mango.Core.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType)
      var controller, debug, content;
      var currentRowCount;
      var isPaging;
 
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
 
       public function UpdateRows()
      {
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