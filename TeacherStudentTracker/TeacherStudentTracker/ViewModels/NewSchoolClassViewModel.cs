using BasicDataTemplateSample.ViewModels;
using System.Windows.Input;

namespace TeacherStudentTracker.ViewModels
{
    public class NewSchoolClassViewModel : ViewModelBase
    {
        public ICommand AddCustomFieldCommand { get; }

        public ICommand SaveSchoolClassCommand { get; }

        public NewSchoolClassViewModel(ICommand addCustomFieldCommand, ICommand saveSchoolClassCommand)
        {
            this.AddCustomFieldCommand = addCustomFieldCommand;
            this.SaveSchoolClassCommand = saveSchoolClassCommand;
        }
    }
}
