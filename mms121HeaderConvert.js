import System;
import System.Collections;
import System.Windows.Controls;
import System.Web.UI.WebControls;
import System.Windows.Input;
import System.Windows.Media;
import Lawson.M3.MI;
import Mango.UI.Services.Lists;
import MForms;
import System.Windows.Threading;
import Mango.UI.Services.Lists.EditableCell;

package MForms.JScript {
   class mms121HeaderConvert {
   var convRate = 0.453; //2.2046;
 //var  conversionRate : float = 0.453;
		var listView;
		var controller;
		var content;
		var debug : Object;
		var rows : IList;
		var columns : System.Windows.Controls.GridViewColumnCollection;
		var scrollViewer : System.Windows.Controls.ScrollViewer;
		var oldCount : Double = 0,
		newCount : Double = 0;
		var listControl;
		var columnIndex;
		var field;
		var sort;
		var fields; // : String[] = new String[5];
		var lblConvert : Label = new Label();
		var msg = "Not Converted";
		var program;
      public function Init(element: Object, args: Object, controller : Object, debug : Object) {
       try {
				this.controller = controller;
				this.content = controller.RenderEngine.Content;
				this.debug = debug;
				program = controller.RenderEngine.PanelHeader;
				//theses 2 lines make the script wait until content is loaded
			if((ScriptUtil.FindChild(content, 'MMUNMS')).Text == 'KG'){
				var startDelegate : Action = MyStart;
				content.Dispatcher.BeginInvoke(DispatcherPriority.Background, startDelegate);
				}
				// include both lines in every script
			} catch (ex : Exception) {
				//debug.WriteLine(ex);
			}

         

         

      }
	  		function MyStart() {
				if((controller.RenderEngine.PanelName == 'MMA121BC')){
			calc(ScriptUtil.FindChild(content, 'WXORQT'));
			//Jean 7-20-2015 removed WXSQTY field form Jscript
			//calc(ScriptUtil.FindChild(content, 'WXSQTY'));
			calc(ScriptUtil.FindChild(content, 'WXALQT'));
			calc(ScriptUtil.FindChild(content, 'WXPQTT'));
			ScriptUtil.FindChild(content, 'MMUNMS').Text = "LB";
			
		}
		}
			function calc(field) {
			var ff = new FontFamily("Arial Black");
			try {
				var fieldVal  ;
		
				field.FontFamily = ff;
				if (field.Text == '') {
					field.Text = '0.00';
				}
				fieldVal = parseFloat(field.Text)
					if (isNaN((parseFloat(fieldVal)))) {
						field.Text = (fieldVal / convRate).toFixed(3) + '-';
					} else {
						field.Text = (fieldVal / convRate).toFixed(3);
					}
			} catch (ex) {
				//debug.WriteLine(ex + 'calc ');
			}
		}
   }
}
