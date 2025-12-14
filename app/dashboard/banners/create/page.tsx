import BannerForm from "../../components/BannerForm";

const CreatePage = async () => {

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Add a New Banner</h2>
      <BannerForm />
    </section>
  );
};

export default CreatePage;
