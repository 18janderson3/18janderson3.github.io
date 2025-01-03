using Avalonia.Media.Imaging;
using BasicDataTemplateSample.ViewModels;
using ReactiveUI;
using System.Windows.Input;

namespace TeacherStudentTracker.ViewModels
{
    public class MainWindowViewModel : ViewModelBase
    {
        public ICommand NewStudentCommand { get; }

        public ICommand AddSchoolClassCommand { get; }

        public ICommand LoadSchoolClassCommand { get; }

        public ICommand SaveSchoolClassCommand { get; }

        public ICommand DeleteClassCommand { get; }

        public ICommand DuplicateClassCommand { get; }

        public ICommand EditStudentCommand { get; }

        public ICommand AddDeskCommand { get; }

        public ICommand AddMiscObjectCommand { get; }
        
        public ICommand EditClassCommand { get; }

        public ICommand SaveAsSchoolClassCommand { get; }
        
        public ICommand DeleteStudentCommand { get; }

        public Bitmap DefaultStudentImage => Constants.DefaultStudentImageBitmap;

        private string? _searchText;

        public string? SearchText
        {
            get => _searchText;
            set => this.RaiseAndSetIfChanged(ref _searchText, value);
        }

        private bool _isBusy;

        public bool IsBusy
        {
            get => _isBusy;
            set => this.RaiseAndSetIfChanged(ref _isBusy, value);
        }

        public MainWindowViewModel(ICommand newStudentCommand, ICommand addSchoolClassCommand, ICommand loadSchoolClassCommand, ICommand saveSchoolClassCommand, ICommand editStudentCommand, ICommand addDeskCommand, ICommand deleteClassCommand, ICommand duplicateClassCommand, ICommand addMiscObjectCommand, ICommand editClassCommand, ICommand saveAsSchoolClassCommand, ICommand deleteStudentCommand)
        {
            this.NewStudentCommand = newStudentCommand;
            this.AddSchoolClassCommand = addSchoolClassCommand;
            this.LoadSchoolClassCommand = loadSchoolClassCommand;
            this.SaveSchoolClassCommand = saveSchoolClassCommand;
            this.EditStudentCommand = editStudentCommand;
            this.AddDeskCommand = addDeskCommand;
            this.DeleteClassCommand = deleteClassCommand;
            this.DuplicateClassCommand = duplicateClassCommand;
            this.AddMiscObjectCommand = addMiscObjectCommand;
            this.EditClassCommand = editClassCommand;
            SaveAsSchoolClassCommand = saveAsSchoolClassCommand;
            DeleteStudentCommand = deleteStudentCommand;
        }
    }
}