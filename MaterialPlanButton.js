import System;
/* 'Double'  'Exception'  'Action'   'Uri'   */
import System.Collections; //'IList'
import System.Windows.Controls;
/*'Button'  'GridViewColumnHeader' 'GridViewColumn' 'Grid'  */
import Mango.UI.Services.Lists; //'ListCellTemplateSelector'
import MForms;
import System.Windows.Threading;
import Mango.UI.Services; // 'DashboardTaskService'
import System.Windows; //'RoutedEventArgs'
import Mango.Services; //'ApplicationServices
import System.Windows.Forms;

import Mango.UI.Core;
import Mango.UI.Core.Util;
import Mango.UI.Services;
package MForms.JScript {
	class MaterialPlanButton extends System.Windows.Forms.Form { 
		var controller;
		var content;
		var debug : Object;  
		var button : Button = new Button();
		var btnContent = 'Item statistics';
		var btnName = "mms090Btn"; 
		public function Init(element : Object, args : Object, controller : Object, debug : Object) {
			try {
				 
				this.controller = controller;
				this.content = controller.RenderEngine.Content;
				this.debug = debug;
				//theses 2 lines make the script wait until content is loaded
				var startDelegate : Action = MyStart;
				content.Dispatcher.BeginInvoke(DispatcherPriority.Background, startDelegate);
				// include both lines in every script
			} catch (ex : Exception) {
				 
			}

		}
		function MyStart() {
			 
			try {
				//Setting button properties
				button.Content = btnContent;
				button.Name = btnName;
				Grid.SetColumnSpan(button, 20);
				Grid.SetRowSpan(button, 3);
				Grid.SetColumn(button, 40);
				Grid.SetRow(button, 0);
				//Adding button
				content.Children.Add(button);
				//Adding event listeners
				button.add_Click(OnClick);
				controller.add_Requested(OnRequested);
			} catch (ex : Exception) {
				 
			}
		}
		public function OnClick(sender : Object, e : RoutedEventArgs) {
			//GET INFO
			var whloField = "WWWHLO";
			var itnoField = "WWITNO";
			var whlo = ScriptUtil.FindChild(content, whloField).Text;
			var itno = ScriptUtil.FindChild(content, itnoField).Text;
			//CALL MMS090
			var auto = new MFormsAutomation(); 
			auto.AddStep(ActionType.Run, 'MMS090');
			auto.AddStep(ActionType.Key, 'ENTER');
			auto.AddField(whloField, whlo);
			auto.AddField(itnoField, itno);
			auto.AddField("WWPAVR", 'TEST');
			auto.AddStep(ActionType.Key, 'F5'); 
			var uri = auto.ToUri();
			//OPEN MMS090
			DashboardTaskService.Manager.LaunchTask(new Task(uri));
		}
		public function OnRequested(sender : Object, e : RequestEventArgs) {
			try {
				var controller : MForms.InstanceController = sender;
				if (controller.RenderEngine == null) {
					// program is closing, clean-up
					//remove any objects 
					button.remove_Click(OnClick);
					controller.remove_Requested(OnRequested);
				}
			} catch (ex : Exception) {
			 
			}

		}
	}
}
