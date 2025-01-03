using Avalonia.Media.Imaging;
using Avalonia.Platform;
using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.IO;
using TeacherStudentTracker.Views;

namespace TeacherStudentTracker.Data
{
    public class Student : ICloneable
    {
        public int ID { get; set; }

        [JsonIgnore] public bool Save {get; set; } = false;

        public string FirstNames { get; set; }

        public string LastName { get; set; }

        public GenderEnum Gender { get; set; } = GenderEnum.Unknown; 

        [JsonIgnore]
        private Bitmap PictureBMP { get; set; }

        [JsonIgnore]
        public Bitmap Picture 
        { 
            get
            {
                return this.PictureBMP;
            }

            set
            {
                this.PictureBMP = value;
                this.PictureBMPString = ConvertBitmapToString(value);
            } 
        }

        private string PictureBMPString {  get; set; } = string.Empty;

        public string PictureString 
        {
            get
            {
                return this.PictureBMPString;
            }

            set
            {
                this.PictureBMPString = value;
                this.PictureBMP = ConvertStringToBitmap(value);
            }
        }

        public List<CustomField> ExtraFields { get; set; }

        public double XTransform { get; set; } = 0;

        public double YTransform { get; set; } = 0;

        public Student(int? id = null, string? firstNames = null, string? lastNames = null, List<CustomField>? extraFields = null, string? picture = null, double x = 0, double y = 0)
        {
            if (id is not null)
            {
                this.ID = id.Value;
            }
            else
            {
                this.ID = MainWindow.SelectedSchoolClass!.CurrentStudentID;
                MainWindow.SelectedSchoolClass!.CurrentStudentID++;
            }

            this.FirstNames = firstNames is not null ? firstNames : string.Empty;
            this.LastName = lastNames is not null ? lastNames : string.Empty;
            if(picture is not null)
            {
                this.PictureString = picture;
            }
            else
            {
                this.Picture = new Bitmap(AssetLoader.Open(new Uri(Constants.DefaultStudentImage)));
            }

            this.ExtraFields = extraFields is not null ? extraFields : [];

            this.XTransform = x;
            this.YTransform = y;
        }

        private static string ConvertBitmapToString(Bitmap bitmap)
        {
            // Convert the bitmap to a byte array
            MemoryStream ms = new();
            bitmap.Save(ms);
            byte[] byteImage = ms.ToArray();

            // Convert the byte array to a base64 string
            return Convert.ToBase64String(byteImage);
        }

        private static Bitmap ConvertStringToBitmap(string str)
        {
            byte[] byteImage = Convert.FromBase64String(str);
            MemoryStream ms = new(byteImage);
            return new Bitmap(ms);
        }

        public object Clone()
        {
            Student clone = (Student)this.MemberwiseClone(); //create a shallow-copy of the object

            clone.ID = MainWindow.SelectedSchoolClass!.CurrentStudentID;
            MainWindow.SelectedSchoolClass!.CurrentStudentID++;

            return clone;
        }
    }

    public enum GenderEnum
    {
        Unknown = 0,
        Male = 1,
        Female = 2
    }
}
