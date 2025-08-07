import { Plus, X } from 'lucide-react';
import { useState } from 'react';

const categories = [
  "Mobile",
  "Laptop",
  "Tablet",
  "Camera",
  "Accessories",
  "Other"
];

const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB

const FloatingAddButton = () => {
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(0);

  // Form state
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageError, setCoverImageError] = useState('');
  const [images, setImages] = useState([]);
  const [imagesError, setImagesError] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [formError, setFormError] = useState('');

  // Reset form when closed
  const handleClose = () => {
    setShowForm(false);
    setStep(0);
    setCategory('');
    setTitle('');
    setDescription('');
    setCoverImage(null);
    setCoverImageError('');
    setImages([]);
    setImagesError('');
    setLocation('');
    setPrice('');
    setFormError('');
  };

  // Step validation
  const handleNext = () => {
    setFormError('');
    if (step === 0 && !category) {
      setFormError('Please select a category.');
      return;
    }
    if (step === 1 && (!title.trim() || !description.trim())) {
      setFormError('Please enter title and description.');
      return;
    }
    if (step === 2 && !coverImage) {
      setFormError('Please upload a cover image.');
      return;
    }
    if (step === 3 && images.length === 0) {
      setFormError('Please upload at least one image.');
      return;
    }
    if (step === 4 && (!location.trim() || !price.trim())) {
      setFormError('Please enter location and price.');
      return;
    }
    setStep(step + 1);
  };

  // File handlers
  const handleCoverImage = (e) => {
    setCoverImageError('');
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setCoverImageError('File must be an image.');
      setCoverImage(null);
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setCoverImageError('Image must be less than 1MB.');
      setCoverImage(null);
      return;
    }
    setCoverImage(file);
  };

  const handleImages = (e) => {
    setImagesError('');
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setImagesError('You can upload up to 5 images.');
      return;
    }
    for (let file of files) {
      if (!file.type.startsWith('image/')) {
        setImagesError('All files must be images.');
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setImagesError('Each image must be less than 1MB.');
        return;
      }
    }
    setImages(files);
  };

  // Final submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    // Final validation
    if (!category || !title.trim() || !description.trim() || !coverImage || images.length === 0 || !location.trim() || !price.trim()) {
      setFormError('Please fill all fields.');
      return;
    }
    // TODO: Replace with actual API/database call
    alert('Form submitted!\n' + JSON.stringify({
      category, title, description, coverImage: coverImage.name, images: images.map(f => f.name), location, price
    }, null, 2));
    handleClose();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110"
      >
        <Plus className="h-8 w-8" />
      </button>

      {/* Multi-Step Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold text-white mb-4">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Step 0: Category */}
              {step === 0 && (
                <div>
                  <label className="block text-white mb-2">Category</label>
                  <select
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Step 1: Title & Description */}
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-white mb-2">Title</label>
                    <input
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      maxLength={100}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Description</label>
                    <textarea
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      maxLength={500}
                      required
                    />
                  </div>
                </>
              )}

              {/* Step 2: Cover Image */}
              {step === 2 && (
                <div>
                  <label className="block text-white mb-2">Cover Image (max 1MB)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImage}
                    className="w-full text-white"
                  />
                  {coverImage && (
                    <div className="mt-2 text-green-400 text-sm">{coverImage.name}</div>
                  )}
                  {coverImageError && (
                    <div className="mt-2 text-red-400 text-sm">{coverImageError}</div>
                  )}
                </div>
              )}

              {/* Step 3: Multiple Images */}
              {step === 3 && (
                <div>
                  <label className="block text-white mb-2">Additional Images (up to 5, each max 1MB)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImages}
                    className="w-full text-white"
                  />
                  {images.length > 0 && (
                    <div className="mt-2 text-green-400 text-sm">
                      {images.map(f => f.name).join(', ')}
                    </div>
                  )}
                  {imagesError && (
                    <div className="mt-2 text-red-400 text-sm">{imagesError}</div>
                  )}
                </div>
              )}

              {/* Step 4: Location & Price */}
              {step === 4 && (
                <>
                  <div>
                    <label className="block text-white mb-2">Location</label>
                    <input
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      maxLength={100}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Price (₹)</label>
                    <input
                      type="number"
                      className="w-full p-2 rounded bg-gray-700 text-white"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      min={0}
                      required
                    />
                  </div>
                </>
              )}

              {/* Step 5: Review & Submit */}
              {step === 5 && (
                <div className="text-white">
                  <div className="mb-2"><b>Category:</b> {category}</div>
                  <div className="mb-2"><b>Title:</b> {title}</div>
                  <div className="mb-2"><b>Description:</b> {description}</div>
                  <div className="mb-2"><b>Cover Image:</b> {coverImage?.name}</div>
                  <div className="mb-2"><b>Images:</b> {images.map(f => f.name).join(', ')}</div>
                  <div className="mb-2"><b>Location:</b> {location}</div>
                  <div className="mb-2"><b>Price:</b> ₹{price}</div>
                  <div className="mt-4 text-yellow-400 text-sm">Please review before submitting.</div>
                </div>
              )}

              {formError && (
                <div className="text-red-400 text-sm">{formError}</div>
              )}

              <div className="flex justify-between mt-6">
                {step > 0 && step < 5 && (
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-600 text-white rounded-md"
                    onClick={() => setStep(step - 1)}
                  >
                    Back
                  </button>
                )}
                {step < 5 && (
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                )}
                {step === 5 && (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                  >
                    Add Product
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAddButton;