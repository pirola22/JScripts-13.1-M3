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
import Mango.UI.Utils;

package MForms.JScript {
	class MMS063_B {
		var convRate = 0.453; //2.2046;
		var listView;
		var hf = new HiddenField();
		var controller;
		var content;
		var debug : Object;
		var rows : IList;
		var columns : System.Windows.Controls.GridViewColumnCollection;
		var scrollViewer : System.Windows.Controls.ScrollViewer;
		var oldCount : Double = 0,
		newCount : Double = 0;
		var listControl;
		//var fieldColumnIndex;s
		var field;
		var sort;
		var fieldLbs : String = 0;
		var fields; // : String[] = new String[5];
		var lblConvert : Label = new Label();
		var msg = "Not Converted";
		var program;
		var hidden;
					var		ff = new FontFamily("Arial Black");
		public function Init(element : Object, args : Object, controller : Object, debug : Object) {
			try {
				debug.WriteLine('------------------------------------------------------------------------Init---------------------');
				this.controller = controller;
				this.content = controller.RenderEngine.Content;
				this.debug = debug;
				program = controller.RenderEngine.PanelHeader;
				//	debug.WriteLine(program);
				//theses 2 lines make the script wait until content is loaded
			if((ScriptUtil.FindChild(content, 'LBL_L69T5')).Content == 'KG'){
				var startDelegate : Action = MyStart;
				content.Dispatcher.BeginInvoke(DispatcherPriority.Background, startDelegate);
				}
				// include both lines in every script
			} catch (ex : Exception) {
				debug.WriteLine(ex);
			}
		}
		function MyStart() {
			debug.WriteLine('------------------------------------------------------------------------MyStart---------------------');
			try {
			
				listControl = controller.RenderEngine.ListControl;
				//columnIndex = listControl.GetColumnIndexByName(field);
				//	debug.WriteLine(columnIndex);
				//pupolate list view
				this.listView = controller.RenderEngine.ListControl.ListView;
				this.rows = listView.Items;
				this.columns = listView.View.Columns;
				//end populate list view
				//add column
				var gvch = new GridViewColumnHeader();

				var gvc = new GridViewColumn();
				gvc.Header = gvch;
				gvc.CellTemplateSelector = new ListCellTemplateSelector(columns.Count, controller.RenderEngine.ListControl.Columns);
				columns.Add(gvc);
				//add column
				if (listView.ItemsSource != null) {
					// debug.WriteLine("New version of ListView");
					rows = IList(listView.ItemsSource); // Use the ItemsSource to get data
				} else {
					//	// debug.WriteLine("Old version of ListView");
					rows = listView.Items; //Get the items
				}
				// logic
				//check sort order
				sort = controller.PanelState["WWQTTP"];

				switch (program) {

				case 'MMS063/B1':
					fields = new String[1];
					fields[0] = "TRQT";

					break;
				}
if((ScriptUtil.FindChild(content, 'LBL_L69T5')).Content == 'KG'){
				//start a for loop
				for (var i = 0; i < fields.length; i++) {
					debug.WriteLine('------------------------------------------------------------------------checking for field ' + fields[i] + '---------------------');
					var fieldColumnIndex = listControl.GetColumnIndexByName(fields[i]);

					if (fieldColumnIndex == -1) {
						// debug.WriteLine(fields[i] + ' does not exist \n');
						continue;
					} else {
						// check if the field exist
						//if it does send it to the calc method
						calc(0, rows.Count - 1, fields[i]);
					}

				}
	
				var txtBx1 = ScriptUtil.FindChild(content, "WWESQT");
				var txtBx2 = ScriptUtil.FindChild(content, "WWSTQT");
				var txtBx3 = ScriptUtil.FindChild(content, "WWALQT");
				var txtBx4 = ScriptUtil.FindChild(content, "WWAVOH");
				var txtBx5 = ScriptUtil.FindChild(content, "WWPAQT");
				var txtBx6 = ScriptUtil.FindChild(content, "WWSEQT");
				
				txtBxCalc(txtBx1);
				txtBxCalc(txtBx2);
				txtBxCalc(txtBx3);
				txtBxCalc(txtBx4);
				txtBxCalc(txtBx5);
				txtBxCalc(txtBx6);
				
				
				ScriptUtil.FindChild(content, 'LBL_L69T4').Foreground = Brushes.Red ;
				ScriptUtil.FindChild(content, 'LBL_L69T5').Foreground = Brushes.Red ;
				ScriptUtil.FindChild(content, 'LBL_L69T6').Foreground = Brushes.Red ;
				ScriptUtil.FindChild(content, 'LBL_L69T7').Foreground = Brushes.Red ;
				ScriptUtil.FindChild(content, 'LBL_L30T7').Foreground = Brushes.Red ;
				ScriptUtil.FindChild(content, 'LBL_L69T4').Foreground = Brushes.Red;
				
				ScriptUtil.FindChild(content, 'LBL_L69T4').FontFamily = ff;
				ScriptUtil.FindChild(content, 'LBL_L69T5').FontFamily = ff;
				ScriptUtil.FindChild(content, 'LBL_L69T6').FontFamily = ff;
				ScriptUtil.FindChild(content, 'LBL_L69T7').FontFamily = ff;
				ScriptUtil.FindChild(content, 'LBL_L30T7').FontFamily = ff;
				
				ScriptUtil.FindChild(content, 'LBL_L69T4') .Content = 'LB';
				ScriptUtil.FindChild(content, 'LBL_L69T5') .Content = 'LB';
				ScriptUtil.FindChild(content, 'LBL_L69T6') .Content = 'LB';
				ScriptUtil.FindChild(content, 'LBL_L69T7') .Content = 'LB';
				ScriptUtil.FindChild(content, 'LBL_L30T7') .Content = 'LB';
				ScriptUtil.FindChild(content, 'LBL_L69T4') .Content = 'LB';
				}
				
				//end logic
				oldCount = newCount = rows.Count;
				var typeScrollViewer : Type = Type.GetType("System.Windows.Controls.ScrollViewer, PresentationFramework, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35");
				scrollViewer = Helpers.FindElementOfType(listControl.ListView, typeScrollViewer);
				if (scrollViewer != null) {
			this.scrollViewer.add_ScrollChanged(OnScrollChanged);
			
			
			}
				
				var currentRowCount = rows.Count;
				controller.add_RequestCompleted(OnRequestCompleted);
			} catch (ex : Exception) {
				debug.WriteLine(ex);
			}
		}
		function calc(from, to, field) {
			debug.WriteLine('------------------------------------------------------------------------Calc---------------------');
			try {
				listControl = controller.RenderEngine.ListControl;
				var fieldColumnIndex = listControl.GetColumnIndexByName(field); //listControl.GetColumnIndexByName(field);
				debug.WriteLine(' 1 ');
				var unms;
				for (var i = from; i <= to; i++) {
					// The new placeholder is in the list - add some data
					//have to layover the onhand column 
					var row = listView.Items[i];
					unms = (ScriptUtil.FindChild(content, 'LBL_L69T5')).Content;  
					debug.WriteLine(' 2 ' + unms);
					if (unms == 'KG') {  
						var fieldKg = row.Item[fieldColumnIndex] * 1; 
						var isNegative : boolean = false;
						var fieldSkg : Object = new String(row.Item[fieldColumnIndex]);
						if (isNaN(fieldKg)) {
							debug.WriteLine(fieldKg + ' is not a number');
							fieldKg = parseInt(fieldSkg) * 1;
							fieldLbs = ((fieldKg /  convRate).toFixed(3) + '-');
							isNegative = 1;
						} else {
							fieldKg = (row.Item[fieldColumnIndex]) * 1;
							fieldLbs = (fieldKg /  convRate).toFixed(3);
						} 
						var alqtColumnIndex = listControl.GetColumnIndexByName('AVOH');

						if (alqtColumnIndex != -1) { 
						var alqtLbs;
						var alqtKg = row.Item[alqtColumnIndex] * 1;

						isNegative = false;
						var alqtSkg : Object = new String(row.Item[alqtColumnIndex]); 
						if (isNaN(alqtKg)) {
						debug.WriteLine(alqtSkg + ' is not a number');
						alqtKg = parseInt(alqtSkg) * 1;
						alqtLbs = ((alqtKg /  convRate).toFixed(3) + '-');
						isNegative = 1;
						} else {
						alqtKg = (row.Item[alqtColumnIndex]) * 1;
						alqtLbs = (alqtSkg /  convRate).toFixed(3);
						}
						} 
						debug.WriteLine(' 3 ' + alqtLbs);
						var newItems = new Object[row.Items.length];
						row.Items.CopyTo(newItems, 0);

						if (listControl.GetColumnIndexByName(field) != -1) {
							newItems[fieldColumnIndex] = (fieldLbs);
						}
						
						if (listControl.GetColumnIndexByName('AVOH') != -1) {
						newItems[alqtColumnIndex] = (alqtLbs);
						} 
					} else {
						if (unms == 'LB') {
							var newItems = new Object[row.Items.length];
							row.Items.CopyTo(newItems, 0);

							if (listControl.GetColumnIndexByName(field) != -1) {
								newItems[fieldColumnIndex] = row.Item[fieldColumnIndex]; //(fieldKg );
							}
							 
							if (listControl.GetColumnIndexByName('ALQT') != -1) {
							debug.WriteLine(row.Item[alqtColumnIndex]);
							newItems[alqtColumnIndex] = row.Item[alqtColumnIndex]; //(alqtLbs);

							} 
						}

					}
					row.Items = newItems;
					// Replace row
					rows.RemoveAt(i);
					rows.Insert(i, row);
				}
				//	}
			} catch (ex) {
				debug.WriteLine(ex + 'calc ');
			}

		}
		function OnScrollChanged(sender : Object, e : ScrollChangedEventArgs) {
			debug.WriteLine('------------------------------------------------------------------------OnScroll---------------------');
			if (e.VerticalChange == 0) {
				debug.WriteLine("in  event " + e.VerticalChange + ' ll' + fieldLbs);
				oldCount = listView.Items.Count;

			} else {
if((ScriptUtil.FindChild(content, 'LBL_L69T5')).Content == 'KG'){
				var newCount = listView.Items.Count;
				var diff : int = newCount - oldCount;
				var fromRow = oldCount;
				var toRow = listView.Items.Count - 1;
				if (diff > 0) {

					switch (program) {
					case 'MMS063/B1':
						fields = new String[1];
						fields[0] = "TRQT";
						break;
					}

					// code here
					//logic starts here

					for (var i = 0; i < fields.length; i++) {
						var fieldColumnIndex = listControl.GetColumnIndexByName(fields[i]);
						if (fieldColumnIndex == -1) {
							//continue;
						} else {
							// check if the field exist
							//if it does send it to the calc method
							calc(fromRow, toRow, fields[i]);
						}
					}
				}
			}
}
		}
		function OnRequestCompleted(sender : Object, e : RequestEventArgs) {
			debug.WriteLine('------------------------------------------------------------------------OnRequestComplete---------------------');
			try {
				var controller : MForms.InstanceController = sender;
				//if (controller.RenderEngine == null) {
				var controller;
				content = null;
				debug = null;
				rows = null;
				columns = null;

				oldCount = 0,
				newCount = 0;
				listControl = null;
				//	fieldColumnIndex = null;
				// program is closing, cleanup
				//remove any objects
				scrollViewer.remove_ScrollChanged(OnScrollChanged);
				controller.remove_RequestCompleted(OnRequestCompleted);
				debug.WriteLine("Clean-Up");
				//}
			} catch (ex : Exception) {
				debug.WriteLine(ex);
			}
		}
		function txtBxCalc(field) {
			try {
		
			var fieldVal;
				debug.WriteLine("in calc"+ field.Text);
				field.FontFamily = ff;
					if (field.Text == '') {
					field.Text = '0.00';
				}
				debug.WriteLine("1 ");
					fieldVal=parseInt(field.Text)
					debug.WriteLine("2 ");
			if (isNaN((parseInt(fieldVal)))) {
				field.Text = (fieldVal /  convRate).toFixed(3) + '-';
				 
			} else {
				 field.Text = (fieldVal /  convRate).toFixed(3);
			 
			}
				
				 field.Foreground = Brushes.Red; //makes the value red
			} catch (ex) {
				debug.WriteLine(ex + 'calc ');
			}
		}

	}

}
