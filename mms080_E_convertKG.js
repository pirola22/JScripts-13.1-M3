import System;
import System.Collections;
import System.Windows.Controls;
import System.Windows.Input;
import System.Windows.Media;
import Lawson.M3.MI;
import Mango.UI.Services.Lists;
import MForms;
import System.Windows.Threading;


package MForms.JScript {
	class mms080_E_convertKG {
		//Use element instead of scriptutil
		var listView;
		//var aList : ArrayList;
		//Set globals here
		var controller;
		var content : Object;
		var debug : Object;
		var rows : IList;
		var columns : System.Windows.Controls.GridViewColumnCollection;
		var scrollViewer : System.Windows.Controls.ScrollViewer;
		var oldCount : Double = 0,
		newCount : Double = 0;
		var textbox;
		var textbox1;
		var textbox2;
		var textbox3;
		var textbox4;
		var textbox5;
		var listControl;
		var columnIndex;
		var convRate = 0.453; //2.2046;
	var element;
		public function Init(element : Object, args : Object, controller : Object, debug : Object) {
		this.element = element;
		debug.WriteLine('--------------------------------------------' + 'INIT' + '------------------------------');

			try {
			
				this.controller = controller;
			
				this.content = controller.RenderEngine.Content;
			
				this.debug = debug;
				
				//theses 2 lines make the script wait until content is loaded
				var startDelegate : Action = MyStart;
				content.Dispatcher.BeginInvoke(DispatcherPriority.Background, startDelegate);
				
				// include both lines in every script
			} catch (ex : Exception) {
				debug.WriteLine(ex);
			}

		}
		function MyStart() {
debug.WriteLine('--------------------------------------------' + 'MYSTART' + '------------------------------');
			try {
			 
				 
		debug.WriteLine( ScriptUtil.FindChild(content, 'LBL_L71T17').Content + 'LDLD');
			if(element.Content == 'KG'){
				textbox1 = txtBx('WWTRQT', 55, 16, 15);
				textbox2 = txtBx('WWALQT', 55, 15, 15);
				textbox3 = txtBx('WWPQTY', 55, 14, 15);
				textbox4 = txtBx('WWPQOH', 55, 17, 15);
				textbox5 = txtBx('WWAVTP', 55, 18, 15);
				element.Content = "LB";
				element.Foreground = Brushes.Red;
				var ff = new FontFamily("Arial Black"); ;
			element.FontFamily = ff;
			}
			} catch (ex : Exception) {
				debug.WriteLine(ex);
			}
		}
		function txtBx(field, col, row, cSpan) {
		debug.WriteLine('--------------------------------------------' + 'TEXTBOX' + '------------------------------');
			debug.WriteLine('1');
			this.textbox = new TextBox();
			textbox.MinHeight = Configuration.ControlHeight;
			textbox.Height = Configuration.ControlHeight;
			var ff = new FontFamily("Arial Black"); ;
			textbox.FontFamily = ff;
			//textbox.FontSize = 10.5;
			textbox.Foreground = Brushes.Red;
			debug.WriteLine(textbox.FontSize)
			var isNegative : boolean = false;
			var lbs = 0;
			Grid.SetColumn(textbox, col);
			Grid.SetRow(textbox, row);
			//Grid.set
			Grid.SetColumnSpan(textbox, cSpan);
			Grid.SetRowSpan(textbox, 1);
			textbox.isEnabled = false;
			controller.RenderEngine.Content.Children.Add(textbox);
			var Skg : String = "";
			Skg = ScriptUtil.FindChild(content, field).Text;
			var TRQT = parseInt(ScriptUtil.FindChild(content, field).Text);
			debug.WriteLine((ScriptUtil.FindChild(content, 'LBL_L71T17').Content) + 'LDLD');

			if (isNaN(Skg)) {
				lbs = (TRQT /  convRate).toFixed(3);
				textbox.Text = lbs + '-';
				isNegative = true;
			} else {
				textbox.Text = (Skg /  convRate).toFixed(3);
			}

			textbox.TextAlignment = 'Right';
			textbox.IsReadOnly = true;
			this.debug = debug;
			
			return textbox;
		}
		function calc(from, to) {}
		function OnScrollChanged(sender : Object, e : ScrollChangedEventArgs) {}
		function OnRequestCompleted(sender : Object, e : RequestEventArgs) {
debug.WriteLine('--------------------------------------------' + 'REQUESTCOMPLETED' + '------------------------------');
			try {
				var controller : MForms.InstanceController = sender;
				if (controller.RenderEngine == null) {
					// program is closing, cleanup
					//remove any objects
					scrollViewer.remove_ScrollChanged(OnScrollChanged);
					controller.remove_RequestCompleted(OnRequestCompleted);
					debug.WriteLine("Clean-Up");
				}
			} catch (ex : Exception) {
				debug.WriteLine(ex);
			}

		}

	}
}
