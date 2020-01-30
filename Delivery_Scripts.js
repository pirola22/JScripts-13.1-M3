/**
@author Jean Monchery
this script works for programs:
 *MWS411/B1
 *DRS100/B1
 *MWS420/B1
 *MWS423/B1
 *MWS410/B
 *MWS4173/B
 */
 import System;
import System.Windows;
import System.Windows.Controls;
import System.Windows.Data;
import System.Windows.Media;
import System.Windows.Markup;
import System.Windows.Threading;
import MForms;
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
import Mango.UI.Utils;
import Systems.Windows.Control.TextBlock;
import Mango.UI.Core;
import Mango.UI.Core.Util;
import Mango.UI.Services;
import System.Windows.Markup;
import System.Windows.Data;
package MForms.JScript {

	public class Delivery_Scripts {
		var controller;
		var debug;
		var fields;
		var content;
		var program;
		var listControl;
		var listView;
		var isLoaded = false;
		public function Init(element : Object, args : Object, controller : Object, debug : Object) {
			this.controller = controller;
			this.debug = debug;
			this.content = controller.RenderEngine.Content;
			var action : Action = ChangeColumnTemplate;
			Application.Current.Dispatcher.BeginInvoke(DispatcherPriority.Input, action);

		}

		private function ChangeColumnTemplate() {
			var columnIndex; 
			program = controller.RenderEngine.PanelHeader;
			fields = getArray(program);
			listControl = controller.RenderEngine.ListControl;
			
			for (var i = 0; i < fields.length; i++) {
				columnIndex = listControl.GetColumnIndexByName(fields[i]);
				if (columnIndex != -1) {
					var bindingPath = "[" + columnIndex + "]";
					var brush;
					var listView = controller.RenderEngine.ListControl.ListView;
					var selector = new CustomTemplateSelector();
					
					selector.columnIndex = columnIndex;
					selector.templateRed = CreateForegroundCellTemplate(bindingPath, Brushes.Red);
					selector.templateBlack = CreateForegroundCellTemplate(bindingPath, Brushes.Black);
					selector.debug = debug;
					SetColumnTemplateSelector(listView, columnIndex, selector);
					listView.Items.Refresh();
				}
			}
		}
		private function CreateForegroundCellTemplate(bindingPath, brush) {
			var xamlTemplate = "<DataTemplate><TextBlock Text=\"{{Binding Path={0}, Mode=OneWay}}\" Foreground=\"{1}\" HorizontalAlignment=\"Right\"  /></DataTemplate>";
			var xaml = String.Format(xamlTemplate, bindingPath, brush);
			return ParseTemplate(xaml);
		}

		private function SetColumnTemplateSelector(listView, columnIndex, selector) {
			var gridView = listView.View;
			var column = gridView.Columns[columnIndex];
			column.CellTemplateSelector = selector;
		}

		private function ParseTemplate(xaml) {
			var context = new ParserContext();
			context.XmlnsDictionary.Add("", "http://schemas.microsoft.com/winfx/2006/xaml/presentation");
			context.XmlnsDictionary.Add("x", "http://schemas.microsoft.com/winfx/2006/xaml");
			return XamlReader.Parse(xaml, context);
		}
		function getArray(program) {

			switch (program) {
			case 'MWS410/B':
				fields = new String[5];
				fields[0] = "GRWE";
				fields[1] = "GRW2";
				fields[2] = "GWTE";
				fields[3] = "NEWE";
				fields[4] = "NEW2";
				return fields;

			case 'DRS100/B':
				fields = new String[3];
				fields[0] = "GRW2";
				fields[1] = "GRW3";
				fields[2] = "GRWE";
				return fields;

			case 'MMS121/B1':
				fields = new String[1];
				fields[0] = "STQT";

				return fields;

			case 'MWS411/B':
				fields = new String[5];
				fields[0] = "GRWE";
				fields[1] = "NEWE";
				fields[2] = "GRW2";
				fields[3] = "GWTE";
				fields[4] = "NEW2";

				return fields;

			case 'MWS420/B1':
				fields = new String[4];
				fields[0] = "GRWE";
				fields[1] = "NEWE";
				fields[2] = "CLPW";
				fields[3] = "GRWE";
				return fields;
			case 'MWS423/B1':
				fields = new String[8];
				fields[0] = "GRWE";
				fields[1] = "GRW2";
				fields[2] = "NEWE";
				fields[3] = "NEW2";
				fields[4] = "GWTI";
				fields[5] = "GWTM";
				fields[6] = "NTWM";
				fields[7] = "NTWI";
				return fields;
			case 'MMS473/B1':
				fields = new String[2];
				fields[0] = "GRWE";
				fields[1] = "NEWE";
				return fields;
			}

		}
	}

	public class CustomTemplateSelector extends DataTemplateSelector {
		var columnIndex;
		var templateRed;
		var templateBlack;
		var debug : Object;
		var fields;
		public override function SelectTemplate(row : Object, container : DependencyObject) : DataTemplate {

			var text = row[columnIndex];
			if (  text == '') {
			text = "0.0";
			}
			if (text.Contains(".") | text == '') {
				var lbs : String = 0;
				var convRate = 0.453;
				var newItems = new String[row.Items.length + 1];
				row.Items.CopyTo(newItems, 0);
				var kg = row.Item[columnIndex] * 1;
				var isNegative : boolean = false;
				var Skg : Object = new String( text);
			
				lbs = (parseFloat(Skg) / convRate).toFixed(0);
				if(Skg.Contains("-")){
				newItems[columnIndex] = lbs + '-' + "";
				}else{
				newItems[columnIndex] = lbs;
				}
				row.Items = newItems;
				return templateRed;
			} else {
				return templateRed;
			}
		}
	}
}

