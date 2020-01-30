import System;
import System.Windows;
import System.Windows.Controls;
import MForms;
import Mango.UI;
import System.Windows.Threading;
import Mango.UI.Core;
import Mango.UI.Core.Util;
import Mango.UI.Services;
import Lawson.M3.MI;
import System.Globalization;

package MForms.JScript {

    class OIS100I_Charge {

        var controller;
        var debug;
        var orno, fld5, fld6, b_addCharges;
        
        public function Init(element: Object, args: Object, controller : Object, debug : Object) {
            this.controller = controller;
            var content : Object = controller.RenderEngine.Content;
            this.debug = debug;
   
            this.orno = ScriptUtil.FindChild(content, "OAORNO");
            
            var WWFLD5 : Object = FindElement(content, "WWFLD5");

            if(WWFLD5 == null)
                return;

            this.fld5 = ScriptUtil.FindChild(content, "WWFLD5");
            this.fld6 = ScriptUtil.FindChild(content, "WWFLD6");

            // Create the button
            this.b_addCharges = new Button();
            b_addCharges.Content = 'Apply Charges';
            //b_addCharges.ToolTip = 'Apply Charges';

            //Set button properties
            //Horizontal
            b_addCharges.HorizontalAlignment = HorizontalAlignment.Left;
            Grid.SetColumn(b_addCharges, 75);
            Grid.SetColumnSpan(b_addCharges, 98);
         

            // Vertical
            b_addCharges.VerticalAlignment = VerticalAlignment.Top;
            Grid.SetRow(b_addCharges, 20);
            Grid.SetRowSpan(b_addCharges, 23);


            b_addCharges.Width = 10 * Configuration.CellWidth;
            b_addCharges.Height = 1 * Configuration.CellHeight;


            controller.RenderEngine.Content.Children.Add(b_addCharges);

            b_addCharges.add_Click(OnClick);
            b_addCharges.add_Unloaded(OnUnloaded);
            
            controller.add_Requested(OnRequested);
         }

        function OnClick(sender:Object, e:RoutedEventArgs) {
            try {
                var record = new MIRecord();

                record["ORNO"] = this.orno.Text;
                record["CRID"] = this.fld5.Text;
				
				var CRAM=".01";
               	
               	if(this.fld6.Text.length > 0)
                    CRAM = this.fld6.Text;
                
                record["CRAM"] = CRAM;
                
                //debug.WriteLine(this.orno.Text);
                //debug.WriteLine(this.fld5.Text);
                //debug.WriteLine(CRAM);
                
                MIWorker.Run("OIS100MI", "AddConnCOCharge", record, responseForMI);
            } catch (ex: Exception) {
            	debug.WriteLine(ex);
                ConfirmDialog.ShowWarningDialog("AddConnCOCharge : exception occured = " + ex);
            }
        }

        public function responseForMI(response: MIResponse) {
        
            if (response.HasError) {
                ConfirmDialog.ShowWarningDialog(response.Error);
                return;
            } else {
            	ConfirmDialog.ShowInformationDialog("Information Message", "Charge has been applied");
            	return;
            }
        }

        public function FindElement(content: Object, elementName: String) : Object {
         var i : int = 0;
         for(i=0; i<content.Children.Count; i++) {
            if(content.Children[i].Name.Equals(elementName)) {
               return (content.Children[i]);
            }
         }
         return (null);
      }
        
        
        function OnUnloaded(sender:Object, e:RoutedEventArgs) {
            sender.remove_Unloaded(OnUnloaded);
            sender.remove_Click(OnClick);
        }

        function OnRequested(sender: Object, e: RequestEventArgs) {
	        sender.remove_Requested(OnRequested);
	        b_addCharges.remove_Click(OnClick);
        }
    }
}