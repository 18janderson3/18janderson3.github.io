using System;
using Avalonia.Media.Imaging;
namespace TeacherStudentTracker.Data
{
    public class CustomField
    {
        private static int CurrentID { get; set; } = 0;

        public int ID { get; set; }

        public string Name { get; set; }

        public ValidFieldTypes FieldType { get; set; }

        private object? _data;

        public object? Data
        {
            get => this._data;

            set
            {
                switch (this.FieldType)
                {
                    case ValidFieldTypes.Number:
                        this._data = Convert.ToDouble(value); 
                        break;

                    case ValidFieldTypes.Text:
                        this._data = (string)value!; 
                        break;

                    case ValidFieldTypes.Date:
                        this._data = (DateTime)value!; 
                        break;

                    case ValidFieldTypes.Image:
                        this._data = (Bitmap)value!; 
                        break;

                    default:
                        throw new ArgumentException("Invalid Field Type");
                }
            }
        }

        public CustomField(string name, ValidFieldTypes type)
        {
            this.ID = CurrentID;
            CurrentID++;

            this.Name = name;
            this.FieldType = type;
            this.Data = null;
        }
    }

    public enum ValidFieldTypes
    {
        Text = 0,
        Number = 1,
        Date = 2,
        Image = 3,
        // TODO: Add more here?
    }
}
