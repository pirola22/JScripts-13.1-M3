import System;
import System.Windows;
import System.Windows.Controls;
import System.Windows.Media;
import MForms;

package MForms.JScript {
class tms230_Align {
	var list, content;

	public function Init(element: Object, args: Object, controller : Object, debug : Object) {
		content = controller.RenderEngine.Content;
		list = controller.RenderEngine.ListControl;
		if(list != null) {
			Align("INT1");
			Align("OUT1");
			Align("INT2");
			Align("OUT2");
			AlignTextBoxes();
			list.ResizeSlaves();
		}
	}

	function Align(baseName) {
		var x : Control;
		var i : int = 0;
		var name : String;
		for(i=1; i<=7; i++) {
			name = "W" + i + baseName;
			x = ScriptUtil.FindChild(content, name);
			if(x != null) {
				x.HorizontalContentAlignment = HorizontalAlignment.Right;
				list.AddSlave(x, i);
			}
		}
	}

	function AlignTextBoxes() {
		var tb1 : Control, tb2 : Control, stack, grid, row : int, margin;
		var i : int = 0;
		var name : String;
		for(i=1; i<=7; i++) {
			name = "W" + i + "ABS1";
			tb1 = ScriptUtil.FindChild(content, name);
			name = "W" + i + "ABS2";
			tb2 = ScriptUtil.FindChild(content, name);
			if(tb1 != null && tb2 != null) {
				tb1.Width = tb1.ActualWidth;
				tb2.Width = tb2.ActualWidth;
				margin = tb2.Margin;
				margin.Right = 0;
				tb2.Margin = margin;
				stack = new StackPanel();
				stack.Orientation = Orientation.Horizontal;
				stack.HorizontalAlignment = HorizontalAlignment.Right;
				content.Children.Remove(tb1);
				content.Children.Remove(tb2);
				stack.Children.Add(tb1);
				stack.Children.Add(tb2);

				grid = new Grid();
				grid.Children.Add(stack);
				row = Grid.GetRow(tb1);
				Grid.SetRow(grid, row);
				Grid.SetRow(stack, row);

				content.Children.Add(grid);
				list.AddSlave(grid, i);
			}
		}
	}
}
}