using Avalonia.Media.Imaging;
using Avalonia.Platform;
using System;
using System.IO;

namespace TeacherStudentTracker
{
    public static class Constants
    {
        public const string StringNoStudentsYet = "This class does not have any students yet, click the add student button in the top right to add one.";
        public const string StringNoClassSelected = "Select a Class to get started...";
        public const string ErrorDescription1 = "An error has occured. If you would like to create a backup of your save, click the Create Backup button below. Then please copy the error below and email it to JaredBrian5828@gmail.com with a description of what you were doing at the time the error occured.";
        public const string ErrorDescription2 = "A fatal error has occured. If you would like to create a backup of your save, click the Create Backup button below. Then please copy the error below and email it to JaredBrian5828@gmail.com with a description of what you were doing at the time the error occured. WARNING! Because the error was fatal, the program will close once you exit this window.";
        public const string ErrorDescription3 = "Warning! Are you sure you want to close this window? You have not created a backup.";

        public static string SaveFolder = Path.Combine(AppContext.BaseDirectory, "save");
        public const string DefaultStudentImage = "avares://TeacherStudentTracker/Assets/DefaultStudentProfile.jpg";
        public static Bitmap DefaultStudentImageBitmap = new(AssetLoader.Open(new Uri(DefaultStudentImage)));

        public const string MomsBlue1 = "#19BDAE";
        public const string MomsBlue2 = "#11D8C6";
        public const string MomsBlue3 = "#0CEDD8";
        public const string CustomGray1 = "#E0E0E0";
        public const string CustomGray2 = "#B0B0B0";
        public const string CustomGray3 = "#909090";
    }
}
