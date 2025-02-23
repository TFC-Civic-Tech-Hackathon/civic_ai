import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          {/* Title */}
          <h1 className="text-4xl font-bold mb-8">PoliSights.ai</h1>
          
          {/* Live Application Link */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Live Application</h2>
            <a
              href="https://codelabs-preview.appspot.com/?file_id=1xOJo6D40dsWjctPaj2Z7uZlOG9cHrW0DRejiGDkK9XM#0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              View Application
            </a>
          </div>

          {/* Technologies Used */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Technologies Used</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"
                  alt="ReactJS"
                />
              </a>
              <a href="https://fastapi.tiangolo.com/" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://img.shields.io/badge/fastapi-109989?style=for-the-badge&logo=FASTAPI&logoColor=white"
                  alt="FastAPI"
                />
              </a>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white"
                  alt="GitHub"
                />
              </a>
              <a href="https://www.python.org/" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://img.shields.io/badge/Python-FFD43B?style=for-the-badge&logo=python&logoColor=blue"
                  alt="Python"
                />
              </a>
              <a href="https://pandas.pydata.org/" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://img.shields.io/badge/Pandas-2C2D72?style=for-the-badge&logo=pandas&logoColor=white"
                  alt="Pandas"
                />
              </a>
              <a href="https://numpy.org/" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://img.shields.io/badge/Numpy-777BB4?style=for-the-badge&logo=numpy&logoColor=white"
                  alt="NumPy"
                />
              </a>
              <a href="https://openai.com/" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white"
                  alt="OpenAI"
                />
              </a>
              <a href="https://www.snowflake.com/" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://img.shields.io/badge/Snowflake-0093F1?style=for-the-badge&logo=snowflake&logoColor=white"
                  alt="Snowflake"
                />
              </a>
              <a href="https://huggingface.co/docs/transformers/en/model_doc/bert" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://img.shields.io/badge/-HuggingFace-FF9900?style=for-the-badge&logo=HuggingFace&logoColor=white"
                  alt="HuggingFace"
                />
              </a>
              <a href="https://www.docker.com/" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white"
                  alt="Docker"
                />
              </a>
              <a href="https://airflow.apache.org/" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://img.shields.io/badge/Airflow-FF4B4B?style=for-the-badge&logo=Apache%20Airflow&logoColor=white"
                  alt="Airflow"
                />
              </a>
              <a href="https://www.selenium.dev/" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://img.shields.io/badge/Selenium-43B02A?style=for-the-badge&logo=Selenium&logoColor=white"
                  alt="Selenium"
                />
              </a>
              <a href="https://plotly.com/" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://img.shields.io/badge/Plotly-239120?style=for-the-badge&logo=plotly&logoColor=white"
                  alt="Plotly"
                />
              </a>
              <a href="https://www.mongodb.com/" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white"
                  alt="MongoDB"
                />
              </a>
              <a href="https://www.pinecone.io/" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://img.shields.io/badge/Pinecone-220052?style=for-the-badge"
                  alt="Pinecone"
                />
              </a>
            </div>
          </div>

          {/* Overview */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mt-12 mb-4">Overview</h2>
            <p className="text-lg text-gray-700 mb-8">
              PoliSights.ai is an AI-powered platform that helps small businesses stay informed about federal policy changes in real time. The system extracts policies from the Federal Register, processes them using AI and NLP techniques, and delivers personalized recommendations and alerts. This enables businesses to make informed decisions, streamline compliance, and focus on growth.
            </p>
          </div>

          {/* Problem Statement */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mt-12 mb-4">Problem Statement</h2>
            <p className="text-lg text-gray-700 mb-8">
              Small businesses face challenges in keeping up with frequent regulatory updates that can impact their operations. The manual process of searching, interpreting, and complying with policies is time-consuming, inefficient, and expensive—putting these businesses at a competitive disadvantage.
            </p>
          </div>

          {/* Our Solution */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mt-12 mb-4">Our Solution</h2>
            <p className="text-lg text-gray-700 mb-8">
              PoliSights.ai provides an automated, AI-driven solution to extract, analyze, and match policies with the specific needs of your business. With real-time alerts, intelligent recommendations, and an intuitive dashboard, we help small businesses adapt quickly to regulatory changes and maintain compliance without the overhead of large legal teams.
            </p>
          </div>

          {/* Key Features */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mt-12 mb-4">Key Features</h2>
            <ul className="text-lg text-gray-700 mb-8 list-disc list-inside">
              <li>Real-Time Policy Alerts – Instant notifications on relevant updates.</li>
              <li>AI-Powered Search & Recommendations – Advanced matching using NLP and vector search.</li>
              <li>User-Friendly Dashboard – Manage compliance and policy trends effortlessly.</li>
              <li>Industry Insights & Compliance Risk Analysis – Understand the impact of policy changes on your business.</li>
            </ul>
          </div>

          {/* Project Tree */}

          {/* Prerequisites */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mt-12 mb-4">Prerequisites</h2>
            <ul className="text-lg text-gray-700 mb-8 list-disc list-inside">
              <li>Python installed on your system</li>
              <li>Docker Desktop installed</li>
              <li>Virtual environment setup (using venv or virtualenv)</li>
              <li>Required Python dependencies installed via <code>pip install -r requirements.txt</code></li>
              <li>Proper configuration in <code>configuration.properties</code> files</li>
            </ul>
          </div>

          {/* How to Run Locally */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mt-12 mb-4">How to Run Locally</h2>
            <ol className="text-lg text-gray-700 mb-8 list-decimal list-inside">
              <li>Clone the repository.</li>
              <li>Activate your virtual environment (e.g., <code>source/venv/bin/activate</code>).</li>
              <li>Create necessary configuration files from provided examples.</li>
              <li>Run <code>docker-compose up --build</code> to start the application.</li>
              <li>Access the Airflow UI at <code>http://localhost:8080/</code>.</li>
              <li>Open the React application in your browser.</li>
              <li>Register or log in to use the app.</li>
            </ol>
          </div>

          {/* Additional Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mt-12 mb-4">Additional Information</h2>
            <p className="text-lg text-gray-700 mb-8">
              This project was developed by 2nd-year graduate students from Northeastern University pursuing a degree in Software Engineering Systems. We built PoliSights.ai during the Tech for Change Hackathon at Boston University to address the real-world challenges faced by small businesses in keeping up with regulatory changes.
            </p>
          </div>

          <Button asChild>
            <Link
              to="/"
              className="px-6 py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark transition"
            >
              Back to Home
            </Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
