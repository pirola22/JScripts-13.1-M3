import System;
import System.Windows;
import System.Windows.Controls;
import System.Text;
import System.IO;
import Mango.UI;
import System.Diagnostics;
import MForms;

package MForms.JScript {
	class PrjStr3_0Proj_clsPrjStr3_0 {
		var exe = "PrjStr3_0.exe";
		var env = "PROJECT_STARTER_PATH_3_0";
		var msgTitle = "Project Starter 3.0 is not installed or configured properly.";
		var msgText = "Please refer to the Project Starter 3.0 documentation.";
		var content, button, args;

		public function Init(element: Object, args: Object, controller : Object, debug : Object) {
			content = controller.RenderEngine.Content;
			this.args = args;
			button = element;
			button.add_Click(OnClick);
			button.add_Unloaded(OnUnloaded);			
		}

		public function OnUnloaded(sender : Object,  e : RoutedEventArgs) {
			button.remove_Unloaded(OnUnloaded);
			button.remove_Click(OnClick);
		}

		public function OnClick(sender: Object, e: RoutedEventArgs) {
			var path = Environment.GetEnvironmentVariable(env, EnvironmentVariableTarget.Machine);
			if(String.IsNullOrEmpty(path) || path == undefined) {
				ConfirmDialog.ShowAttentionDialog(msgTitle, msgText, null);
				return;
			}
			if(!path.EndsWith(Path.DirectorySeparatorChar.ToString())) {
				path += Path.DirectorySeparatorChar;
			}

			var sb : StringBuilder = new StringBuilder();
			AddParam("WWPROJ", sb, content);
			AddParam("WWDTUM", sb, content);
			AddParam("LACONO", sb, content);
			AddParam("LADIVI", sb, content);

			var field = ScriptUtil.FindChild(content, "WWVERS");
			if(field != null) {
				var version = field.Text;
				if (String.IsNullOrEmpty(version)) {
					version = "00";
				}
				sb.Append(" ");
				sb.Append(version);
			}

			if(args != null) {
				sb.Append(" ");
				sb.Append(args);
			}

			var psi : ProcessStartInfo = new ProcessStartInfo(path + exe, sb.ToString().Trim());
			psi.UseShellExecute = false;
			if(!psi.EnvironmentVariables.ContainsKey(env)) {
			   psi.EnvironmentVariables.Add(env, path);
			}
			Process.Start(psi);
		}

		function AddParam(name, sb, content) {
			var field = ScriptUtil.FindChild(content, name);
			if(field != null) {
				sb.Append(" ");
				sb.Append(field.Text);
			}
		}
	}
}