import System;
import System.Windows;
import System.Windows.Controls;
import MForms;

package MForms.JScript {
   class ScriptTester {
      public function Init(element: Object, args: Object, controller : Object, debug : Object) {
         debug.WriteLine("Script Initializing.");
         if(element != null) {
            debug.WriteLine("Connected element: " + element.Name);
         }

         var content : Object = controller.RenderEngine.Content;

         var message : String = "Script Tester\n";
         if(element != null)
         {
             message = message + "Connected element: " + element.Name + "\n";
         }
         else
         {
            message = message + "No element connected.\n";
         }
         if(args != null)
         {
             message = message + "Arguments: " + args;
         }
         MessageBox.Show(message);
      }
   }
}
