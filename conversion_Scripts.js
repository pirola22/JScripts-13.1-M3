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
	class conversion_Scripts {
		var convRate = 0.453; //2.2046;
		var listView;
		// adding a control to indicate when its converted
		//FIND OUT WHY KG ISNT TURNING INTO LB
		//Set globals here
	var controller;
		var content;
		var debug : Object;
		var rows : IList;
		var columns : System.Windows.Controls.GridViewColumnCollection;
		
		var oldCount : Double = 0,
		newCount : Double = 0;
		var listControl;
		var columnIndex;
		var field;
		var sort;
		var fields; // : String[] = new String[5];
		var kgIndex;
		var lblConvert : Label = new Label();
		var program
		var scrollViewer : System.Windows.Controls.ScrollViewer;
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
			debug.WriteLine("-------------------------------------------In Satrt---------------------------------");
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
			
				if (program == 'MMS060/B1') {
					fields = new String[5];
					debug.WriteLine(program + ' is the name of this program');
					//var fields : String[] = new String[5];
					fields[0] = "STQT";
					fields[1] = "_2SAQ";
					fields[2] = "AVQT";
					fields[3] = "_1STQ";
					fields[4] = "_1AVQ";
					
					
				}

				//start a for loop
				for (var i = 0; i < fields.length; i++) {
debug.WriteLine('array size is '+fields.length );
					// check for special sort orders
					if (sort == 1) {
						//set columnIndex to correct column
					}
					columnIndex = listControl.GetColumnIndexByName(fields[i]);
					if (columnIndex == -1) {
						debug.WriteLine(fields[i] + ' does not exist \n');
						continue;
					} else {
					debug.WriteLine(fields[i] + ' does  exist index is   ' + columnIndex);
						// check if the field exist
						//if it does send it to the calc method
						var UM = ScriptUtil.FindChild(content, 'MMUNMS').Text;
					//	if (UM == 'KG') {
						calc(0, rows.Count - 1, fields[i]);
						debug.WriteLine('FIELD IS ' + fields[i]);
						
						//}
					}
				}
				//end logic
				oldCount = newCount = rows.Count;
				
			var typeScrollViewer : Type = Type.GetType("System.Windows.Controls.ScrollViewer, PresentationFramework, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35");
			scrollViewer = Helpers.FindElementOfType(listControl.ListView, typeScrollViewer);
		
			
			
			this.scrollViewer.add_ScrollChanged(OnScrollChanged);
				var currentRowCount = rows.Count;
				controller.add_RequestCompleted(OnRequestCompleted);
			} catch (ex : Exception) {
				debug.WriteLine(ex);
			}
		}
		function calc(from, to, field) {
		debug.WriteLine("-------------------------------------------IN calc----------------------------------");
			try {
			//debug.WriteLine('FIELD IS ' + field);
	var kgIndex;
				if (program == 'MMS060/B1') {
						for (i = 1; i < 10; i++) {
			//debug.WriteLine('kg index is : ' + kgIndex);
			
				if ((listControl.GetColumnIndexByName('_' + i + 'UNM')) != -1) {
					kgIndex = listControl.GetColumnIndexByName('_' + i + 'UNM');
					debug.WriteLine('kg index is : ' + kgIndex);
					
					break;
				}
			}
			}
				//var avqt = listControl.GetColumnIndexByName('AVQT');
				listControl = controller.RenderEngine.ListControl;
				columnIndex = listControl.GetColumnIndexByName(field);
				debug.WriteLine(columnIndex + ' ' + field);
				var lbs : String = 0;
				
				
				var grwe;

				for (var i = from; i <= to; i++) { 
				
				//strt for
					// The new placeholder is in the list - add some datap
					//have to layover the onhand column
					var row = listView.Items[i];

					//var UM = 'KG'; //row[listControl.GetColumnIndexByName('UNMS')];
					debug.WriteLine('1');
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
						debug.WriteLine('newItems[kgIndex]' + sort);
						// checking sorting order
						if (sort == 11) {
							row.Item[listControl.GetColumnIndexByName('_3UNM')] = 'LB';
							debug.WriteLine('newItems[kgInccccccccccccdex]' + row.Item[5]);
						}

						if (sort == 12) {

							row.Item[listControl.GetColumnIndexByName('_2UN1')] = 'LB';
							
							debug.WriteLine('sort ' + [listControl.GetColumnIndexByName('_2UNM')]);
							//_2UN1
							//_2UN2
						}

						lbs = (kg /  convRate).toFixed(3);

						var newItems = new String[row.Items.length + 1];

						row.Items.CopyTo(newItems, 0);

						if (isNegative) {
							newItems[columnIndex] = lbs + '-' + "";
							//	debug.WriteLine(lbs + '-' + "< amount after conversion");
							isNegative = false;
						} else {

							newItems[columnIndex] = lbs;
						}
							newItems[kgIndex] = 'LB';
					ScriptUtil.FindChild(content, 'MMUNMS').Text = 'LB';
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
		debug.WriteLine("-------------------------------------------Onscroll changed----------------------------------");
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
						if (columnIndex == -1) {
							//debug.WriteLine(fields[i] + ' does not exist \n');
							continue;
						} else {
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
			 
			} catch (ex : Exception) {
				debug.WriteLine(ex + 'Exception');
			}
		}
	}
}
