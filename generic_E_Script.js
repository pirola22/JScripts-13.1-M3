/*
Shipment_Scripts
MWS411/E
MWS422/E
MWS424/E
MWS423/F
MMS473/E
MWS410/I
MWS423/F
 */
import System;
import System.Windows;
import System.Collections;
import System.Windows.Controls;
import System.Web.UI.WebControls;
import System.Windows.Input;
import System.Windows.Media;
import Lawson.M3.MI;
import Mango.UI.Services.Lists;
import MForms;
import System.Windows.Threading;
import Systems.Windows.Control.TextBlock;
import Mango.UI.Utils;
package MForms.JScript {
	class generic_E_Script {
		var convRate = 0.453; //2.2046;
		//Set globals here
		var controller;
		var content;
		var debug : Object;
		var program;
		var textbox;
		var textbox1;
		var textbox2;
		var listControl;
		var field;
		var fields; //textbox
		var Textbox;
		var UOM; //UOM label
		var ff; //font family
		public function Init(element : Object, args : Object, controller : Object, debug : Object) {
			try {
				this.controller = controller;
				this.content = controller.RenderEngine.Content; //Content on the form
				this.debug = debug;
				program = controller.RenderEngine.PanelHeader;
				//theses 2 lines make the script wait until content is loaded
				var startDelegate : Action = MyStart; //This tells it where to start
				content.Dispatcher.BeginInvoke(DispatcherPriority.Background, startDelegate);
				// include both lines in every script
			} catch (ex : Exception) {
				debug.WriteLine(ex);
			}
		}
		function MyStart() {
			try {
				ff = new FontFamily("Arial");
				switch (program) {

				case 'MWS411/E':
					//Complete
					fields = new TextBox[7]; //Creating a textbox array
					//By using this method, it already finds the position of the specified field, so no need to indicate position
					//Creating as many textboxes as fields, difficulty using strings because we were only using the one created textbox
					fields[0] = ScriptUtil.FindChild(content, "WBTRQT");
					fields[1] = ScriptUtil.FindChild(content, "WBPLQ2");
					fields[2] = ScriptUtil.FindChild(content, "WBORQT");
					fields[3] = ScriptUtil.FindChild(content, "WBRNQT");
					fields[4] = ScriptUtil.FindChild(content, "WBALQT");
					fields[5] = ScriptUtil.FindChild(content, "WBPLQT");
					fields[6] = ScriptUtil.FindChild(content, "WBDLQT");
					var block : TextBlock = null;
					block = ScriptUtil.FindChild(content, "LBL_L65T23").Content;
					UOM = block.Text;
					if (UOM == "KG") {

						for (var i = 0; i < fields.length; i++) {
							var red = Brushes.Red;
							if (fields[i].Foreground != red) {
								UOM = block.Text;
								makeRed(fields[i]);
								calc(fields[i]);
							}
						}
						makeRed(ScriptUtil.FindChild(content, "LBL_L70T18"));
						makeRed(ScriptUtil.FindChild(content, "LBL_L31T18"));
						makeRed(block);
						block.Text = "LB";
						ScriptUtil.FindChild(content, "LBL_L70T18").Content = " LB";
						ScriptUtil.FindChild(content, "LBL_L31T18").Content = " LB";
					}
					break;
				case 'MWS422/E':
					//COMPLETE
					fields = new TextBox[3]; //Creating a textbox array
					//By using this method, it already finds the position of the specified field, so no need to indicate position
					//Creating as many textboxes as fields, difficulty using strings because we were only using the one created textbox
					fields[0] = ScriptUtil.FindChild(content, "WWTRQT");
					fields[1] = ScriptUtil.FindChild(content, "WWPAQT");
					fields[2] = ScriptUtil.FindChild(content, "WWQTYA");
					block = ScriptUtil.FindChild(content, "LBL_L28T17").Content;
					UOM = block.Text;
					if (UOM == "KG") {
						for (var i = 0; i < fields.length; i++) {
							var red = Brushes.Red;
							if (fields[i].Foreground != red) {
								makeRed(fields[i]);
								calc(fields[i]);
								block.Text = "LB";
								makeRed(block);
							}
						}
					}
					break;
				case 'MMS424/E':
					fields = new TextBox[3]; //Creating a textbox array
					//By using this method, it already finds the position of the specified field, so no need to indicate position
					//Creating as many textboxes as fields, difficulty using strings because we were only using the one created textbox
					fields[0] = ScriptUtil.FindChild(content, "WWTRQT");
					fields[1] = ScriptUtil.FindChild(content, "WWPAQT");
					fields[2] = ScriptUtil.FindChild(content, "WWQTYA");
					block = ScriptUtil.FindChild(content, "LBL_L27T17").Content;
					UOM = block.Text;
					if (UOM == "KG") {
						for (var i = 0; i < fields.length; i++) {
							var red = Brushes.Red;
							if (fields[i].Foreground != red) {
								makeRed(fields[i]);
								calc(fields[i]);
								makeRed(block);
								block.Text = "LB";
							}

						}
					} else {
						if (UOM == "LB") {
							//	makeRed((fields[i]));
						}
					}
					break;
				case 'MWS423/F':
					fields = new TextBox[8]; //Creating a textbox array
					//By using this method, it already finds the position of the specified field, so no need to indicate position
					//Creating as many textboxes as fields, difficulty using strings because we were only using the one created textbox
					fields[0] = ScriptUtil.FindChild(content, "M4VOMT");
					fields[1] = ScriptUtil.FindChild(content, "WFGRWE");
					fields[2] = ScriptUtil.FindChild(content, "WFTGRS");
					fields[3] = ScriptUtil.FindChild(content, "WFNEWE");
					fields[4] = ScriptUtil.FindChild(content, "WFTNET");
					fields[5] = ScriptUtil.FindChild(content, "WFNTWM");
					fields[6] = ScriptUtil.FindChild(content, "WFNTWI");
					fields[7] = ScriptUtil.FindChild(content, "WFGWTI");
					for (var i = 0; i < fields.length; i++) {
						makeRed(fields[i]);
						calc(fields[i]);
					}
					break;
				case 'MMS473/E':
					fields = new TextBox[1]; //Creating a textbox array
					//By using this method, it already finds the position of the specified field, so no need to indicate position
					//Creating as many textboxes as fields, difficulty using strings because we were only using the one created textbox
					fields[0] = ScriptUtil.FindChild(content, "WWDLQT");
					block = ScriptUtil.FindChild(content, "LBL_L28T18").Content;
					UOM = block.Text;
					if (UOM == "KG") {
						for (var i = 0; i < fields.length; i++) {
							var red = Brushes.Red;
							if (fields[i].Foreground != red) {
								makeRed(fields[i]);
								calc(fields[i]);

							}
						}
					}
					//weight fields
					var weightFields = new TextBox[4]; //Creating a textbox array
					//By using this method, it already finds the position of the specified field, so no need to indicate position
					//Creating as many textboxes as fields, difficulty using strings because we were only using the one created textbox
					weightFields[0] = ScriptUtil.FindChild(content, "WWGRWE");
					weightFields[1] = ScriptUtil.FindChild(content, "WWNEWE");
					weightFields[2] = ScriptUtil.FindChild(content, "WWVOL3");
					weightFields[3] = ScriptUtil.FindChild(content, "WWFCU1");
					if (block.Text != "LB") {

						for (var i = 0; i < weightFields.length; i++) {
							var red = Brushes.Red;
							if (weightFields[i].Foreground != red) {

								calc(weightFields[i]);
								makeRed(weightFields[i]);

								block.Text = "LB";
								makeRed(block);
							}
						}
					}
					break;
				case 'MWS410/I':
					//Complete
					fields = new TextBox[2]; //Creating a textbox array
					//By using this method, it already finds the position of the specified field, so no need to indicate position
					//Creating as many textboxes as fields, difficulty using strings because we were only using the one created textbox
					fields[0] = ScriptUtil.FindChild(content, "WWGRWE");
					fields[1] = ScriptUtil.FindChild(content, "WWGRW2");
					for (var i = 0; i < fields.length; i++) {
						var red = Brushes.Red;
						if (fields[i].Foreground != red) {
							makeRed(fields[i]);
							calcWeight(fields[i]);
						}
					}
					break;

				case 'DRS110/F':
					fields = new TextBox[5]; //Creating a textbox array
					//By using this method, it already finds the position of the specified field, so no need to indicate position
					//Creating as many textboxes as fields, difficulty using strings because we were only using the one created textbox
					fields[0] = ScriptUtil.FindChild(content, "WWGRW3");
					fields[1] = ScriptUtil.FindChild(content, "WWGRWE");
					fields[2] = ScriptUtil.FindChild(content, "WWFLD4");
					fields[3] = ScriptUtil.FindChild(content, "WWGRW2");
					fields[4] = ScriptUtil.FindChild(content, "WWFL10");
					for (var i = 0; i < fields.length; i++) {
						var red = Brushes.Red;
						if (fields[i].Foreground != red) {
							makeRed(fields[i]);
							calc(fields[i]);
						}
					}
					break;
				case 'MMS470/F':
					//Complete
					fields = new TextBox[6]; //Creating a textbox array
					//By using this method, it already finds the position of the specified field, so no need to indicate position
					//Creating as many textboxes as fields, difficulty using strings because we were only using the one created textbox
					fields[0] = ScriptUtil.FindChild(content, "WFTGRS");
					fields[1] = ScriptUtil.FindChild(content, "WFGWTM");
					fields[2] = ScriptUtil.FindChild(content, "WFTNET");
					fields[3] = ScriptUtil.FindChild(content, "WFNEWE");

					fields[4] = ScriptUtil.FindChild(content, "WFNTWM");
					fields[5] = ScriptUtil.FindChild(content, "WFGRWE");
					//fields[1] = ScriptUtil.FindChild(content, "WFGWTM");
					for (var i = 0; i < fields.length; i++) {
						debug.WriteLine(fields[i].Name + i);
						var red = Brushes.Red;
						if (fields[i].Foreground != red) {
							makeRed(fields[i]);
							calcWeight(fields[i]);
							//debug.WriteLine(fields[i].Name);
						}
					}
					break;
				}
				this.controller.add_Requesting(OnRequesting);
				this.controller.add_RequestCompleted(OnRequestCompleted);
			} catch (ex : Exception) {
				debug.WriteLine(ex);
			}
		}
		public function OnRequestCompleted(sender : Object, e : RequestEventArgs) {
			this.controller.remove_Requested(OnRequesting);
			this.controller.remove_Requesting(OnRequesting);
			this.controller.remove_RequestCompleted(OnRequestCompleted);
		}
		public function makeRed(field) {
			var red = Brushes.Red;
			if (field.Foreground != red) {
				try {
					if (field.Text == '') {
						field.Text = '0.00';
					}
					field.FontFamily = ff;
					field.Foreground = Brushes.Red;
				} catch (ex) {
					debug.WriteLine(ex);
				}
			}
		}
		public function OnRequesting(sender : Object, e : CancelRequestEventArgs) {

			var fieldVal;
			if (e.CommandValue == "ENTER") {

				for (var i = 0; i < fields.length; i++) {

					if (GetBackgroundColor(fields[i]) == "#FFEFEFEF") {
						//display mode
						break;
					} else {
						//edit mode
						fieldVal = parseFloat(fields[i].Text);
						if (isNaN((parseFloat(fieldVal)))) {
							fields[i].Text = (fieldVal * convRate).toFixed(3) + '-';
						} else {
							fields[i].Text = (fieldVal * convRate).toFixed(3);
						}
						break;
					}
				}
			}
		}
		function calc(field) {
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
				debug.WriteLine(ex);
			}
		}
		public function GetBackgroundColor(inputTextBox : TextBox) : String {
			var backgroundColorBrush : SolidColorBrush;
			var backgroundColor : Color;
			var color : String;

			backgroundColorBrush = inputTextBox.Background;
			backgroundColor = backgroundColorBrush.Color;
			color = backgroundColor.ToString();
			return color;
		}
		function calcWeight(field) {
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
				debug.WriteLine(ex);
			}
		}
	}
}
