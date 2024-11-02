import React, { useState } from 'react';

const FolderUpload = () => {
  const [selectedModel, setSelectedModel] = useState('claude-3-sonnet');
  const [folderName, setFolderName] = useState('No folder chosen');
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(new Set());
  const [showFileList, setShowFileList] = useState(false);

  const handleFolderChange = (event) => {
    const fileList = event.target.files;
    if (fileList.length > 0) {
      const folderName = fileList[0].webkitRelativePath.split('/')[0];
      setFolderName(folderName);
      
      // Convert FileList to array and store file information
      const filesArray = Array.from(fileList).map(file => ({
        name: file.name,
        path: file.webkitRelativePath,
        size: file.size,
        type: file.type,
        status: 'pending' // pending, processing, completed, error
      }));
      
      setFiles(filesArray);
      setShowFileList(true);
    }
  };

  const toggleFileSelection = (fileName) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(fileName)) {
      newSelection.delete(fileName);
    } else {
      newSelection.add(fileName);
    }
    setSelectedFiles(newSelection);
  };

  const selectAllFiles = () => {
    const allFiles = new Set(files.map(file => file.name));
    setSelectedFiles(allFiles);
  };

  const deselectAllFiles = () => {
    setSelectedFiles(new Set());
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      <h1 className="text-2xl font-semibold mb-1">Triaging Ophthalmology Patients</h1>
      <p className="text-gray-600 mb-6">Use foundation models to triage Ophthalmology patients at scale.</p>

      <div className="tabs mb-6">
        <button className="tab tab-active text-blue-600 border-b-2 border-blue-600 mr-4">Triage</button>
        <button className="tab">Information</button>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div>
            <p className="mb-2">Upload Folder</p>
            <label htmlFor="folder-upload" className="inline-block">
              <div className="flex items-center space-x-2 cursor-pointer">
                <button className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 border border-gray-300 text-sm">
                  Choose Folder
                </button>
                <span className="text-sm text-gray-600">{folderName}</span>
              </div>
              <input
                type="file"
                id="folder-upload"
                webkitdirectory="true"
                directory="true"
                className="hidden"
                onChange={handleFolderChange}
              />
            </label>
          </div>

          <div className="space-y-2">
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-48 px-3 py-2 rounded border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="claude-3-sonnet">Claude 3 Sonnet</option>
              <option value="claude-3-opus">Claude 3 Opus</option>
              <option value="claude-3-haiku">Claude 3 Haiku</option>
            </select>
          </div>

          {showFileList && files.length > 0 && (
            <div className="mt-6 border rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                <h3 className="font-medium">Files in Folder</h3>
                <div className="space-x-2">
                  <button 
                    onClick={selectAllFiles}
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                  >
                    Select All
                  </button>
                  <button 
                    onClick={deselectAllFiles}
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {files.map((file) => (
                  <div 
                    key={file.path}
                    className="flex items-center px-4 py-3 border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFiles.has(file.name)}
                      onChange={() => toggleFileSelection(file.name)}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    {file.status === 'completed' && (
                      <svg className="w-5 h-5 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                    {file.status === 'error' && (
                      <svg className="w-5 h-5 text-red-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button 
              className={`px-4 py-2 rounded text-sm ${
                folderName === 'No folder chosen'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
              disabled={folderName === 'No folder chosen'}
            >
              Process All Files
            </button>
            
            <button 
              className={`px-4 py-2 rounded text-sm ${
                selectedFiles.size === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
              disabled={selectedFiles.size === 0}
            >
              Process Selected Files ({selectedFiles.size})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderUpload;
