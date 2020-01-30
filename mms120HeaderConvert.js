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
	class mms120HeaderConvert {
		var convRate = 0.453; //2.2046;
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
		public function Init(element : Object, args : Object, controller : Object, debug : Object) {

			try {
				this.controller = controller;
				this.content = controller.RenderEngine.Content;
				this.debug = debug;
				program = controller.RenderEngine.PanelHeader;
				//theses 2 lines make the script wait until content is loaded
				if ((ScriptUtil.FindChild(content, 'MMUNMS')).Text == 'KG') {
					var startDelegate : Action = MyStart;
					content.Dispatcher.BeginInvoke(DispatcherPriority.Background, startDelegate);
				}
				// include both lines in every script
			} catch (ex : Exception) {
				debug.WriteLine(ex);
			}
		}
		function MyStart() {
			calc(ScriptUtil.FindChild(content, 'WWAVAL'));
			makeRed(ScriptUtil.FindChild(content, 'MMUNMS'));
			makeRed(ScriptUtil.FindChild(content, 'WWAVAL'));
			ScriptUtil.FindChild(content, 'MMUNMS').Text = "LB";

		}
		function calc(field) {
			var ff = new FontFamily("Arial Black");
			try {
				var fieldVal;
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
				debug.WriteLine(ex  );
			}
		}
		public function makeRed(field) {
			var ff = new FontFamily("Arial Black");
			var red = Brushes.Red;
			if (field.Foreground != red) {
				try {
					if (field.Text == '') {
						field.Text = '0.00';
					}
					field.FontFamily = ff;
					field.Foreground = Brushes.Red;
				} catch (ex) {
					debug.WriteLine(ex  );
				}
			}
		}
	}
}
