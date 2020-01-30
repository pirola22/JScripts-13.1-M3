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
	class MMS060_E_ConvertLbs {
		
		var listView;
		//var aList : ArrayList;
		
		var controller;
		var content; // : Object;
		var debug : Object;
		var rows : IList;
		var columns : System.Windows.Controls.GridViewColumnCollection;
		var scrollViewer : System.Windows.Controls.ScrollViewer;
		var oldCount : Double = 0,
		newCount : Double = 0;
		var listControl;
		var columnIndex;
		var textbox;
		var convRate = 0.453; //2.2046;
		public function Init(element : Object, args : Object, controller : Object, debug : Object) {
			
			try {
				this.controller = controller;
				this.content = controller.RenderEngine.Content;
				this.debug = debug;
				//theses 2 lines make the script until content is loaded
				var startDelegate : Action = MyStart;
				content.Dispatcher.BeginInvoke(DispatcherPriority.Background, startDelegate);
				// include both lines in every script
			} catch (ex : Exception) {
				debug.WriteLine(ex);
			}
			
		}
		function MyStart() {
			try {
				txtBx1();
			txtBx2();
			txtBx3();
			txtBx4();
			txtBx5();
			} catch (ex : Exception) {
				debug.WriteLine(ex);
			}
			
		}
		
		function txtBx1() {
			this.textbox = new TextBox();
			var isNegative : boolean = false;
			var ff = new FontFamily("Arial");
			textbox.FontFamily = ff;
			var lbs = 0;
			var kg = 0;
			Grid.SetColumn(textbox, 16);
			Grid.SetRow(textbox, 16);
			//Grid.set
			Grid.SetColumnSpan(textbox, 12);
			Grid.SetRowSpan(textbox, 1);
				textbox.MinHeight = Configuration.ControlHeight;
			textbox.Height = Configuration.ControlHeight;
			controller.RenderEngine.Content.Children.Add(textbox);
			var Skg : String = "";
			Skg = ScriptUtil.FindChild(content, 'WWSTQT');
			kg = ScriptUtil.FindChild(content, 'WWSTQT');
			var STQT = parseFloat(ScriptUtil.FindChild(content, 'WWSTQT').Text);
			
			if (isNaN(STQT)) {
				lbs = (STQT /  convRate).toFixed(3);
				textbox.Text = lbs + '-';
				isNegative = true;
			} else {
				
				textbox.Text = (STQT /  convRate).toFixed(3);
			}
			
			textbox.TextAlignment = 'Right';
			textbox.IsReadOnly = true;
			this.debug = debug;
			textbox.isEnabled = false;
			textbox.Foreground = Brushes.Red;
		}
		function txtBx2() {
			debug.WriteLine('txt 2 ');
			this.textbox = new TextBox();
			var ff = new FontFamily("Arial");
			textbox.FontFamily = ff;
			var isNegative : boolean = false;
			var lbs = 0;
			var kg = 0;
			Grid.SetColumn(textbox, 16);
			Grid.SetRow(textbox, 17);
			//Grid.set
			Grid.SetColumnSpan(textbox, 12);
			Grid.SetRowSpan(textbox, 1);
				textbox.MinHeight = Configuration.ControlHeight;
			textbox.Height = Configuration.ControlHeight;
			controller.RenderEngine.Content.Children.Add(textbox);
			var Skg : String = "";
			Skg = ScriptUtil.FindChild(content, 'WWALQT');
			kg = ScriptUtil.FindChild(content, 'WWALQT');
			var ALQT = parseFloat(ScriptUtil.FindChild(content, 'WWALQT').Text);
			
			if (isNaN(ALQT)) {
				lbs = (ALQT /  convRate).toFixed(3);
				textbox.Text = lbs + '-';
				isNegative = true;
			} else {
				debug.WriteLine(ALQT)
				textbox.Text = (ALQT /  convRate).toFixed(3);
			}
			
			textbox.TextAlignment = 'Right';
			textbox.IsReadOnly = true;
			this.debug = debug;
			textbox.isEnabled = false;
			textbox.Foreground = Brushes.Red;
		}
		function txtBx3() {
			debug.WriteLine('txt 3 ');
			this.textbox = new TextBox();
			var ff = new FontFamily("Arial");
			textbox.FontFamily = ff;
			var isNegative : boolean = false;
			var lbs = 0;
			var kg = 0;
			Grid.SetColumn(textbox, 16);
			Grid.SetRow(textbox, 18);
				debug.WriteLine('txt 3 1');
			Grid.SetColumnSpan(textbox, 12);
			Grid.SetRowSpan(textbox, 1);
			textbox.MinHeight = Configuration.ControlHeight;
			textbox.Height = Configuration.ControlHeight;
			controller.RenderEngine.Content.Children.Add(textbox);
			var Skg : String = "";
				debug.WriteLine('txt 3 2');
			Skg = (ScriptUtil.FindChild(content, 'WWSTAQ')).Text;
			kg = (ScriptUtil.FindChild(content, 'WWSTAQ')).Text;
			var STAQ = parseFloat(ScriptUtil.FindChild(content, 'WWSTAQ').Text);
			debug.WriteLine('txt 3 3');
			if (isNaN(STAQ)) {
				lbs = (STAQ /  convRate).toFixed(3);
				textbox.Text = lbs + '-';
				isNegative = true;
			} else {
				debug.WriteLine(STAQ)
				textbox.Text = (STAQ /  convRate).toFixed(3);
			}
			
			textbox.TextAlignment = 'Right';
			textbox.IsReadOnly = true;
			this.debug = debug;
			textbox.isEnabled = false;
			textbox.Foreground = Brushes.Red;
		
		}
		function txtBx4() {
	
			debug.WriteLine('txt 4 ');
			this.textbox = new TextBox();
				var ff = new FontFamily("Arial");
			textbox.FontFamily = ff;
			Grid.SetColumn(textbox, 16);
			Grid.SetRow(textbox, 19);
			
			Grid.SetColumnSpan(textbox, 5);
			Grid.SetRowSpan(textbox, 1);
				textbox.MinHeight = Configuration.ControlHeight;
			textbox.Height = Configuration.ControlHeight;
			
			controller.RenderEngine.Content.Children.Add(textbox);
			
			textbox.Text = 'LB';
			textbox.TextAlignment = 'Left';
			textbox.IsReadOnly = true;
			this.debug = debug;
			textbox.isEnabled = false;
			textbox.Foreground = Brushes.Red;
		}
		function txtBx5() {
			debug.WriteLine('txt 5 ');
			this.textbox = new TextBox();
			var ff = new FontFamily("Arial");
			textbox.FontFamily = ff;
			var isNegative : boolean = false;
			var lbs = 0;
			var kg = 0;
			Grid.SetColumn(textbox, 54);
			Grid.SetRow(textbox, 17);
			//Grid.set
			Grid.SetColumnSpan(textbox, 9);
			Grid.SetRowSpan(textbox, 1);
				textbox.MinHeight = Configuration.ControlHeight;
			textbox.Height = Configuration.ControlHeight;
			controller.RenderEngine.Content.Children.Add(textbox);
			var Skg : String = "";
			Skg = ScriptUtil.FindChild(content, 'WWPAQT');
			kg = ScriptUtil.FindChild(content, 'WWPAQT');
			var PAQT = parseFloat(ScriptUtil.FindChild(content, 'WWPAQT').Text);
			
			if (isNaN(PAQT)) {
				lbs = (PAQT /  convRate).toFixed(3);
				textbox.Text = lbs + '-';
				isNegative = true;
			} else {
				debug.WriteLine(PAQT)
				textbox.Text = (PAQT /  convRate).toFixed(3);
			}
			
			textbox.TextAlignment = 'Right';
			textbox.IsReadOnly = true;
			this.debug = debug;
			textbox.isEnabled = false;
			textbox.Foreground = Brushes.Red;
		}
		function OnRequestCompleted(sender : Object, e : RequestEventArgs) {
			try {
				var controller : MForms.InstanceController = sender;
				if (controller.RenderEngine == null) {
					// program is closing, cleanup
					
					controller.remove_RequestCompleted(OnRequestCompleted);
					textbox = null;
					debug.WriteLine("Clean-Up");
				}
			} catch (ex : Exception) {
				debug.WriteLine(ex);
			}
		}
	}
}

//mws070_B_TRQT.js