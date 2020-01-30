import System;
import System.Windows;
import MForms;

package MForms.JScript {
   class FieldHelpBtn {
      var helpId : Object;
      public function Init(element: Object, args: Object, controller : Object, debug : Object) {
         helpId = args;
         element.add_Click(OnClick);
      }

      public function OnClick(sender: Object, e: RoutedEventArgs) {
         HelpManager.Current.ShowFieldHelp("", helpId);
      }
   }
}