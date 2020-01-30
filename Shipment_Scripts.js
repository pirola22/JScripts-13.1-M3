//Shipment_Scripts
import System;
import System.Collections;
import System.Windows.Controls;
import System.Windows.Input;
import System.Windows.Media;
import Lawson.M3.MI;
import Mango.UI.Services.Lists;
import MForms;
import System.Windows.Threading;
import Mango.UI.Utils;
package MForms.JScript {
	class Shipment_Scripts {
	//figure out whts happening to the negatives

		var convRate = 0.453; //2.2046;
		var listView;
	// adding a control to indicate when its converted
		//Set globals here
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
		var fields;// : String[] = new String[5];
		var lblConvert: Label = new Label();
			var	program 
		public function Init(element : Object, args : Object, controller : Object, debug : Object) {
			try {
				this.controller = controller;
				this.content = controller.RenderEngine.Content;
				this.debug = debug;
			program = controller.RenderEngine.PanelHeader;
	//	debug.WriteLine(program);
				//theses 2 lines make the script wait until content is loaded
				var startDelegate : Action = MyStart;
				content.Dispatcher.BeginInvoke(DispatcherPriority.Background, startDelegate);
				// include both lines in every script
			} catch (ex : Exception) {
				debug.WriteLine(ex);
			}
		}
		function MyStart() {
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
				//	debug.WriteLine("New version of ListView");
					rows = IList(listView.ItemsSource); // Use the ItemsSource to get data
				} else {
				//	debug.WriteLine("Old version of ListView");
					rows = listView.Items; //Get the items
				}
				// logic
				//check sort order
		sort = controller.PanelState["WWQTTP"];
				
				//field = 'GRWE';
				//make array containing possible fields
			if(program == 'MWS410/B'){
			fields = new String[5];
			//debug.WriteLine(program + ' is the name of this program');
			//var fields : String[] = new String[5];
				fields[0] = "GRWE";
				fields[1] = "GRW2";
				fields[2] = "GWTE";
				fields[3] = "NEWE";
				fields[4] = "NEW2";
			}	
			if(program == 'DRS100/B'){
			fields = new String[3];
			//debug.WriteLine(program + ' is the name of this program');
			//var fields : String[] = new String[5];
				fields[0] = "GRW2";
				fields[1] = "GRW3";
				fields[2] = "GRWE";
				
			}	
			if(program == 'MMS121/B1'){
			fields = new String[1];
			debug.WriteLine(program + ' is the name of this program');
			//var fields : String[] = new String[5];
				fields[0] = "STQT";
				//fields[1] = "STQX";
				//fields[2] = "ALQT";
				
			}	
			
			if(program == 'MWS411/B'){
			fields = new String[12];
			debug.WriteLine(program + ' is the name of this program');
			//var fields : String[] = new String[5];
				fields[0] = "GRWE";
				fields[1] = "NEWE";
				fields[2] = "ORQT";
				fields[3] = "DLQT";
				fields[4] = "PLQT";
				fields[5] = "GRWE";
				fields[6] = "GRW2";
				fields[7] = "GWTE";
				fields[8] = "NEWE";
				fields[9] = "NEW2";
				fields[10] ="GRWE";
				fields[11] ="NEWE";
			}	
				
			if(program == 'MWS420/B1'){
			fields = new String[3];
			debug.WriteLine(program + ' is the name of this program');
			//var fields : String[] = new String[5];
				fields[0] = "GRWE";
				fields[1] = "NEWE";
				fields[2] = "CLPW";
				
			}	
			

				//start a for loop
				for (var i = 0; i < fields.length; i++) {
					
					// check for special sort orders
					if (sort == 1) {
						//set columnIndex to correct column
					}
					columnIndex = listControl.GetColumnIndexByName(fields[i]);
					if(columnIndex == -1){
					debug.WriteLine(fields[i] + ' does not exist \n');
					continue;
					}else{
					// check if the field exist
					//if it does send it to the calc method
					calc(0, rows.Count - 1, fields[i]);
					}
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
			try {

				listControl = controller.RenderEngine.ListControl;
				columnIndex = listControl.GetColumnIndexByName(field);
debug.WriteLine(columnIndex + ' ' + field);
				var lbs : String = 0;
				var alqt;
				var epaw;
				var reop;
				var grwe;

				for (var i = from; i <= to; i++) { //strt for
					// The new placeholder is in the list - add some datap
					//have to layover the onhand column
					var row = listView.Items[i];

					var UM = 'KG'; //row[listControl.GetColumnIndexByName('UNMS')];

					if (columnIndex != -1) {
						var kg = row.Item[columnIndex] * 1;
						var isNegative : boolean = false;
						var Skg : Object = new String(row.Item[columnIndex]);

						//check here

						if (isNaN(Skg)) {
							kg = parseInt(Skg);
							isNegative = 1;
						} else {
							kg = row.Item[columnIndex] * 1;

						}
						//Per bobs request, rounding the weights to the nearest whole number.
						lbs = (kg /  convRate).toFixed(0);

						var newItems = new String[row.Items.length + 1];

						row.Items.CopyTo(newItems, 0);
						
						
						if (isNegative) {
							//debug.WriteLine('value u b4 conversion: ' + Skg);
							newItems[columnIndex] = lbs + '-' + "";
						//	debug.WriteLine(lbs + '-' + "< amount after conversion");
							isNegative = false;
						} else {
						
							newItems[columnIndex] = lbs;
						}
					}
			
					row.Items = newItems;
					// Replace row
					rows.RemoveAt(i);
					rows.Insert(i, row);
				}
			} catch (ex) {
				debug.WriteLine(ex + 'calc ');
			}
		}
		function OnScrollChanged(sender : Object, e : ScrollChangedEventArgs) {
			if (e.VerticalChange != 0) {
				oldCount = listView.Items.Count;
			} else {
				var newCount = listView.Items.Count;
				var diff : int = newCount - oldCount;
				var fromRow = oldCount;
				var toRow = listView.Items.Count - 1;
				if (diff > 0) {
				// code here
				//logic starts here
						//check sort order
		sort = controller.PanelState["WWQTTP"];
				//debug.WriteLine('1');
				//field = 'GRWE';
				//make array containing possible fields
			
				fields[0] = "GRWE";
				fields[1] = "GRW2";
				fields[2] = "GWTE";
				fields[3] = "NEWE";
				fields[4] = "NEW2";
					for (var i = 0; i < fields.length; i++) {
					
					// check for special sort orders
					if (sort == 1) {
						//set columnIndex to correct column
					}
					columnIndex = listControl.GetColumnIndexByName(fields[i]);
					if(columnIndex == -1){
					//debug.WriteLine(fields[i] + ' does not exist \n');
					continue;
					}else{
					// check if the field exist
					//if it does send it to the calc method
					//calc(0, rows.Count - 1, fields[i]);
					calc(fromRow, toRow, fields[i]);
					}
				}
					//calc(fromRow, toRow, fields[i]);
				}
			}
		}
		function OnRequestCompleted(sender : Object, e : RequestEventArgs) {

			try {
				var controller : MForms.InstanceController = sender;
				if (controller.RenderEngine == null) {
					var controller;
					content = null;
					debug = null;
					rows = null;
					columns = null;

					oldCount = 0,
					newCount = 0;
					listControl = null;
					columnIndex = null;
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
