using Avalonia.Controls;
using Newtonsoft.Json;
using System.IO;
using System;
using TeacherStudentTracker.Data;
using TeacherStudentTracker.Views;

namespace TeacherStudentTracker
{
    public static class GenericHelpers
    {
        /// <summary>
        ///     A function that will display an error window where the user can copy the error or send an automatic report.
        /// </summary>
        public static async void HandleError(Window owner, string message, bool critical = false)
        {
            var newErrorWindow = new ErrorWindow();
            newErrorWindow.SetErrorMessage(message, critical);

            await newErrorWindow.ShowDialog(owner);
        }

        public static string RemoveWhitespace(string str)
        {
            return string.Join("", str.Split(default(string[]), StringSplitOptions.RemoveEmptyEntries));
        }

        public static void SaveClass(SchoolClass schoolClass)
        {
            
            Directory.CreateDirectory(Constants.SaveFolder);
            if(schoolClass.SaveName is null) schoolClass.SaveName = RemoveWhitespace(schoolClass.Name) + ".json";
            string jString = JsonConvert.SerializeObject(schoolClass, Formatting.Indented);
            string path = System.IO.Path.Combine(Constants.SaveFolder, schoolClass.SaveName);
            File.WriteAllText(path, jString);
        }
    }
}
