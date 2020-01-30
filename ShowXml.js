import System;
import System.Windows;
import System.Windows.Controls;
import MForms;
import Mango.UI.Services;
import Mango.UI;
import System.Xml;
import System.Text;

package MForms.JScript {
   class ShowXml {
      public function Init(element: Object, args: Object, controller : Object, debug : Object) {

         var sb : StringBuilder = new StringBuilder();
         var settings : XmlWriterSettings  = new XmlWriterSettings();
         settings.Indent = true;
         settings.IndentChars = "   ";

         var doc : XmlDocument = new XmlDocument();
         var xml : Object = controller.Response.RawContent;
         doc.LoadXml(xml);

         var writer : XmlWriter = XmlWriter.Create(sb, settings);
         doc.WriteContentTo(writer);
         writer.Close();

         ConfirmDialog.ShowAttentionDialog("XML Response", sb.ToString(), null);
      }
   }
}