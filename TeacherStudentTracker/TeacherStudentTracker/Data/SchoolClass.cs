using Controls;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace TeacherStudentTracker.Data
{
    public class SchoolClass
    {
        private static int CurrentID { get; set; } = 0;

        [JsonIgnore]
        public int ID { get; set; }

        [JsonIgnore] public bool Save {get; set; } = false;

        public string Name { get; set; }

        public string? SaveName { get; set; }

        public List<Student> Students { get; set; } = [];

        public List<string> CustomFields { get; set; } = [];

        public List<Desk> Desks { get; set; } = [];

        public List<MiscObject> MiscObjects { get; set; } = [];

        [JsonIgnore]
        public List<CustomMovableDesk> DeskMovableList { get; set; } = [];

        [JsonIgnore]
        public List<CustomMovableMiscObject> MiscObjectMovableList { get; set; } = [];

        [JsonIgnore]
        public int CurrentStudentID { get; set; } = 0;

        [JsonIgnore]
        public int CurrentDeskID { get; set; } = 0;

        [JsonIgnore]
        public int CurrentMiscObjectID { get; set; } = 0;

        public SchoolClass(string name)
        {
            this.ID = CurrentID;
            CurrentID++;

            this.Name = name;
        }
    }
}
