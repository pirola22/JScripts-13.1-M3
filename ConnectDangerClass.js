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
	class ConnectDangerClass extends System.Windows.Forms.Form {
		var controller;
		var content;
		var debug : Object;
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
			var listControl = controller.RenderEngine.ListControl;
			 fieldName;
			var prno;
			var fieldName = "PRNO";
			prno = listControl.GetColumnValue(fieldName);
			try {
				//CALL CRS212
				var auto = new MFormsAutomation();
				auto.AddStep(ActionType.Run, 'CRS212');
				auto.AddStep(ActionType.Key, 'ENTER');
				auto.AddField('W1ITNO', prno);
				//setting sorting order
				 auto.AddField('WWQTTP', '1');
				auto.AddStep(ActionType.Key, 'F5');
				var uri = auto.ToUri();
				//OPEN CRS212
				DashboardTaskService.Manager.LaunchTask(new Task(uri));
			} catch (ex : Exception) {}
		}
	}
}
