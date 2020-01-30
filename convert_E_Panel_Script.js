/*
convert_E_Panel_Script
MMS301/E
MMS060/E
MWS070/E
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
	class convert_E_Panel_Script {
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
		var moneyFields;
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

				case 'MMS301/E':
					//Complete
					fields = new TextBox[3]; //Creating a textbox array
					//By using this method, it already finds the position of the specified field, so no need to indicate position
					//Creating as many textboxes as fields, difficulty using strings because we were only using the one created textbox
					fields[0] = ScriptUtil.FindChild(content, "WESTQR");
					fields[1] = ScriptUtil.FindChild(content, "WESTQC");
					fields[2] = ScriptUtil.FindChild(content, "WESTQI");
					var block : TextBlock = null;
					block = ScriptUtil.FindChild(content, "LBL_L27T12").Content;
					UOM = block.Text;
					if (UOM == "KG") {

						for (var i = 0; i < fields.length; i++) {
							var red = Brushes.Red;

							if (fields[i].Foreground != red) {

								makeRed(fields[i]);
								calc(fields[i]);
							}
						}
						ScriptUtil.FindChild(content, "LBL_L27T12").Content = " LB";
						ScriptUtil.FindChild(content, "LBL_L27T13").Content = " LB";
						ScriptUtil.FindChild(content, "LBL_L27T15").Content = " LB";
						makeLabelRed(ScriptUtil.FindChild(content, "LBL_L27T12"));
						makeLabelRed(ScriptUtil.FindChild(content, "LBL_L27T13"));
						makeLabelRed(ScriptUtil.FindChild(content, "LBL_L27T15"));

					}
					break;
				case 'MMS060/E':
					fields = new TextBox[4]; //Creating a textbox array
					//By using this method, it already finds the position of the specified field, so no need to indicate position
					//Creating as many textboxes as fields, difficulty using strings because we were only using the one created textbox
					fields[0] = ScriptUtil.FindChild(content, "WWSTQT");
					fields[1] = ScriptUtil.FindChild(content, "WWALQT");
					fields[2] = ScriptUtil.FindChild(content, "WWSTAQ");
					fields[3] = ScriptUtil.FindChild(content, "WWPAQT");
					UOM = ScriptUtil.FindChild(content, "MMUNMS").Text;
					if (UOM == "KG") {

						for (var i = 0; i < fields.length; i++) {
							var red = Brushes.Red;

							if (fields[i].Foreground != red) {

								makeRed(fields[i]);
								calc(fields[i]);
							}
						}

					}
					makeRed(ScriptUtil.FindChild(content, "MMUNMS"));
					ScriptUtil.FindChild(content, "MMUNMS").Text = "LB";
					break;
				case 'MWS070/E':
					//Complete
					fields = new TextBox[3]; //Creating a textbox array
					moneyFields = new TextBox[2]; //Creating a textbox array
					//By using this method, it already finds the position of the specified field, so no need to indicate position
					//Creating as many textboxes as fields, difficulty using strings because we were only using the one created textbox
					fields[0] = ScriptUtil.FindChild(content, "WWTRQT");
					fields[1] =  ScriptUtil.FindChild(content, "WWNSTT");
					fields[2] = ScriptUtil.FindChild(content, "WWCSQT");
					moneyFields[0] =ScriptUtil.FindChild(content, "WWTRPR");
					moneyFields[1] = ScriptUtil.FindChild(content, "WWMFCO");
					//var block : TextBlock = null;
					block = ScriptUtil.FindChild(content, "LBL_L69T7").Content;
					UOM = block.Text;
					if (UOM == "KG") {

						for (var i = 0; i < fields.length; i++) {
							var red = Brushes.Red;

							if (fields[i].Foreground != red) {

								makeRed(fields[i]);
								calc(fields[i]);
							}
						}
						for (var i = 0; i < moneyFields.length; i++) {
							var red = Brushes.Red;

							if (moneyFields[i].Foreground != red) {

								makeRed(moneyFields[i]);
								calcMoney(moneyFields[i]);
							}
						}
						ScriptUtil.FindChild(content, "LBL_L69T7").Content = " LB";
						ScriptUtil.FindChild(content, "LBL_L69T8").Content = " LB";
						ScriptUtil.FindChild(content, "LBL_L69T11").Content = " LB";
						ScriptUtil.FindChild(content, "LBL_L69T12").Content = " LB";
						ScriptUtil.FindChild(content, "LBL_L69T13").Content = " LB";
						makeLabelRed(ScriptUtil.FindChild(content, "LBL_L69T7"));
						makeLabelRed(ScriptUtil.FindChild(content, "LBL_L69T8"));
						makeLabelRed(ScriptUtil.FindChild(content, "LBL_L69T11"));
						makeLabelRed(ScriptUtil.FindChild(content, "LBL_L69T12"));
						makeLabelRed(ScriptUtil.FindChild(content, "LBL_L69T13"));

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
		public function makeLabelRed(field) {
			var red = Brushes.Red;
			if (field.Foreground != red) {
				try {
					if (field.Content == '') {
						field.Content = '0.00';
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
							fields[i].Text = (fieldVal / convRate).toFixed(3) + '-';
						} else {
							fields[i].Text = (fieldVal / convRate).toFixed(3);
						}
						break;
					}
				}
			}
		}
		function calc(field) {
			try {
				var fieldVal : String;
				field.FontFamily = ff;
				if (field.Text == '') {
					field.Text = '0.00';
				}
				fieldVal = parseFloat(field.Text)
					if (isNegative(field.Text)) {
						field.Text = (fieldVal / convRate).toFixed(3) + '-';
					} else {
						field.Text = (fieldVal / convRate).toFixed(3);
					}
			} catch (ex) {
				debug.WriteLine(ex);
			}
		}
		function isNegative(number : String) {
			if (number.substring(((number.length) - 1), number.length) == '-') {
				return true;
			} else {
				if (number.substring(0, 1) == '-') {
					return true;
				}
				return false;
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
						(fieldVal / convRate).toFixed(3) + '-';
					} else {
						field.Text = (fieldVal / convRate).toFixed(3);
					}
			} catch (ex) {
				debug.WriteLine(ex);
			}
		}
		function calcMoney(field) {
			try {
				var fieldVal;
				field.FontFamily = ff;
				if (field.Text == '') {
					field.Text = '0.00';
				}
				fieldVal = parseFloat(field.Text)
					if (isNaN((parseFloat(fieldVal)))) {
						(fieldVal * convRate).toFixed(3) + '-';
					} else {
						field.Text = (fieldVal * convRate).toFixed(3);
					}
			} catch (ex) {
				debug.WriteLine(ex);
			}
		}
	}
}
