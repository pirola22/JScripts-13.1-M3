import System;
import System.Collections;
import System.Windows.Controls;
import System.Windows.Input;
import System.Windows.Media;
import Lawson.M3.MI;
import Mango.UI.Services.Lists;
import MForms;
import System.Windows.Threading;
import System.Windows;
import System.ComponentModel;
import Mango.UI;
package MForms.JScript {
	class mws070_E_convertTRQT {
		var convRate = 0.453; //2.2046;
		var convFactor = 2.5083;
		var listView;
		var actualLbs : Double;
		//Set globals here
		var controller;
		var content;
		var debug : Object;
		var rows : IList;
		var columns : System.Windows.Controls.GridViewColumnCollection;
		var scrollViewer : System.Windows.Controls.ScrollViewer;
		var oldCount : Double =0;
		var		newCount : Double = 0;
		var listControl;
		var columnIndex;
		var label;
		var element;
		var UOM;
	
		var textbox;
		public function Init(element : Object, args : Object, controller : Object, debug : Object) {
			debug.WriteLine('------------------------------------------------------------------------Init---------------------');
			try {
			
				this.controller = controller;
				this.content = controller.RenderEngine.Content;
				this.element = element;
		
            this.debug = debug;
        
				
			
				//theses 2 lines make the script wait until content is loaded
				var startDelegate: Action = MyStart;
				content.Dispatcher.BeginInvoke(DispatcherPriority.Background, startDelegate);
				// include both lines in every script
			} catch (ex : Exception) {
				debug.WriteLine(ex);
			}
			
		}
		function MyStart() {
		debug.WriteLine('------------------------------------------------------------------------Start---------------------');
			try {debug.WriteLine('---------------------------------------------populate fields--------------------------');
					var block : TextBlock = null;
					block = ScriptUtil.FindChild(content, "LBL_L69T7").Content;
					UOM = block.Text; 
			if((UOM == ("KG"))){
 	var txtTRQT = txtBx1();
			txtBx2();
						var block2 : TextBlock = null;
					block2 = ScriptUtil.FindChild(content, "LBL_L69T8").Content;
					block2.Text = "LB";
					block.Text = "LB";
				block.Foreground = Brushes.Red;
					block2.Foreground   = Brushes.Red;
								

		}
			
			} catch (ex : Exception) {
				debug.WriteLine(ex + 'My start');
			}
		 
		}
		function txtBx1(){
		debug.WriteLine('------------------------------------------------------------------------Creatting textbox 1---------------------');
		 textbox = ScriptUtil.FindChild(content, 'WWTRQT');
		var ff = new FontFamily("Arial");
			textbox.FontFamily = ff;
				Grid.SetColumn(textbox, 54);
				Grid.SetRow(textbox, 6);
				
				Grid.SetColumnSpan(textbox, 14);
				Grid.SetRowSpan(textbox, 1);
				textbox.MinHeight = Configuration.ControlHeight;
			textbox.Height = Configuration.ControlHeight;
			textbox.Foreground = Brushes.Red;
				//controller.RenderEngine.Content.Children.Add(textbox);
				var TRQT = parseFloat(ScriptUtil.FindChild(content, 'WWTRQT').Text);
				if (isNaN((ScriptUtil.FindChild(content, 'WWTRQT').Text))){
				textbox.Text = (TRQT/ convRate).toFixed(3) + '-';
				
				}else{
				textbox.Text = (TRQT/ convRate).toFixed(3);
				}
				textbox.TextAlignment='Right';
				actualLbs = TRQT/ convRate;
				var bak  = (actualLbs / convRate).toFixed(3);
				this.debug = debug;
				textbox.isEnabled = false;
		//	AddLabel("MMPPUN", 69, 11, 5);
				return textbox;
		}
		function txtBx2(){
		debug.WriteLine('------------------------------------------------------------------------Creatting textbox 2---------------------');
		this.textbox = ScriptUtil.FindChild(content, 'WWNSTT');
		var ff = new FontFamily("Arial ");
			textbox.FontFamily = ff;
				Grid.SetColumn(textbox, 54);
				Grid.SetRow(textbox, 7);
				
				Grid.SetColumnSpan(textbox, 14);
				Grid.SetRowSpan(textbox, 1);
				textbox.MinHeight = Configuration.ControlHeight;
         textbox.Height = Configuration.ControlHeight;
		 textbox.Foreground = Brushes.Red;
				//controller.RenderEngine.Content.Children.Add(textbox);
				
				var TRPR = parseFloat(ScriptUtil.FindChild(content, 'WWNSTT').Text);
				debug.WriteLine('-------------------------------------' + TRPR);
				if (isNaN((ScriptUtil.FindChild(content, 'WWNSTT').Text))){
				textbox.Text = (TRPR/convRate).toFixed(3) + '-';
				}else{
				textbox.Text = (TRPR/convRate).toFixed(3);
				}
				//textbox.Text = (TRPR*convRate).toFixed(3); 
				textbox.TextAlignment='Right';
				
				this.debug = debug;
				textbox.isEnabled = false;
			//	AddLabel("MMPPUN", 69, 12, 5);
		}
		function txtBx3(){
		debug.WriteLine('------------------------------------------------------------------------Creatting textbox 3---------------------');
		this.textbox = ScriptUtil.FindChild(content, 'WWMFCO');
		var ff = new FontFamily("Arial ");
			textbox.FontFamily = ff;
				Grid.SetColumn(textbox, 54);
				Grid.SetRow(textbox, 12);
				
				Grid.SetColumnSpan(textbox, 15);
				Grid.SetRowSpan(textbox, 1);
				textbox.MinHeight = Configuration.ControlHeight;
         textbox.Height = Configuration.ControlHeight;
		 textbox.Foreground = Brushes.Red;
				//controller.RenderEngine.Content.Children.Add(textbox);
				var MFCO = parseFloat(ScriptUtil.FindChild(content, 'WWMFCO').Text);
				if (isNaN((ScriptUtil.FindChild(content, 'WWMFCO').Text))){
				debug.WriteLine(ScriptUtil.FindChild(content, 'WWMFCO').Text);
				textbox.Text = (MFCO/convRate).toFixed(3) + '-';
				}else{
				textbox.Text = (MFCO/convRate).toFixed(3);
				}
				
				textbox.TextAlignment='Right';
				textbox.IsReadOnly = true;
				
				this.debug = debug;
				textbox.isEnabled = false;
				//AddLabel("MMPPUN", 69, 13, 5);
		}
		function txtBx5(){
		debug.WriteLine('------------------------------------------------------------------------Creatting textbox 5---------------------');
		this.textbox = ScriptUtil.FindChild(content, 'WWNSTQ');
		var ff = new FontFamily("Arial ");
			textbox.FontFamily = ff;
				Grid.SetColumn(textbox, 16);
				Grid.SetRow(textbox, 11);
				
				Grid.SetColumnSpan(textbox, 15);
				Grid.SetRowSpan(textbox, 1);
				textbox.MinHeight = Configuration.ControlHeight;
         textbox.Height = Configuration.ControlHeight;
		 textbox.Foreground = Brushes.Red;
			//	controller.RenderEngine.Content.Children.Add(textbox);
				var NSTQ = parseFloat(ScriptUtil.FindChild(content, 'WWNSTQ').Text);
				if (isNaN((ScriptUtil.FindChild(content, 'WWNSTQ').Text))){
				textbox.Text = (NSTQ/ convRate).toFixed(3) + '-';
				}else{
				textbox.Text = (NSTQ/ convRate).toFixed(3);
				}
				
				textbox.TextAlignment='Right';
				textbox.IsReadOnly = true;
				
				
				this.debug = debug;
				textbox.isEnabled = false;
		}
		function txtBx4(){
		debug.WriteLine('------------------------------------------------------------------------Creatting textbox 4---------------------');
		this.textbox = ScriptUtil.FindChild(content, 'WWCSQT');
		var ff = new FontFamily("Arial ");
			textbox.FontFamily = ff;
				Grid.SetColumn(textbox, 54);
				Grid.SetRow(textbox, 13);
				
				Grid.SetColumnSpan(textbox, 15);
				Grid.SetRowSpan(textbox, 1);
				textbox.MinHeight = Configuration.ControlHeight;
         textbox.Height = Configuration.ControlHeight;
		 textbox.Foreground = Brushes.Red;
				//controller.RenderEngine.Content.Children.Add(textbox);
				var CSQT = parseFloat(ScriptUtil.FindChild(content, 'WWCSQT').Text);
				
				if (isNaN((ScriptUtil.FindChild(content, 'WWCSQT').Text))){
				textbox.Text = (CSQT/ convRate).toFixed(3) + '-';
				}else{
				textbox.Text = (CSQT/ convRate).toFixed(3);
				}
				
				textbox.TextAlignment='Right';
				
				this.debug = debug;
				textbox.isEnabled = false;
				
		}
		public function AddLabel(field, col, row, cSpan) {
		debug.WriteLine('------------------------------------------------------------------------Adding label---------------------');
	  label = new Label();
var ff = new FontFamily("Arial ");
			label.FontFamily = ff;
			 label.Padding = new Thickness(1);
			label.Foreground = Brushes.Red;
			label.MinHeight = Configuration.ControlHeight;
			label.Height = Configuration.ControlHeight;
			 
			 SetPosition(label, col, row, cSpan);
			label.Foreground = Brushes.Red;
			 label.Background = Brushes.AliceBlue;
			controller.RenderEngine.Content.Children.Add(label);
			
			label.Content = 'LB';
			
			this.debug = debug;
			label.isEnabled = false;
			return label;
		
		 
      }
	  public function SetPosition(element, col, row, cSpan) {
	  debug.WriteLine('------------------------------------------------------------------------Setting position---------------------');
	  
         Grid.SetColumn(element, col);
         Grid.SetRow(element, row);
         Grid.SetColumnSpan(element, cSpan);
	
      }
		function OnScrollChanged(sender : Object, e : ScrollChangedEventArgs) {
		
		}
		function OnRequestCompleted(sender : Object, e : RequestEventArgs) {
			debug.WriteLine('------------------------------------------------------------------------OnRequestcompleted---------------------');
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