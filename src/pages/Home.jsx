import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import FormField from '../components/FormField';
import RecommendationCard from '../components/RecommendationCard';
import { profileSchema, QUALIFICATIONS } from '../lib/schema';
import { generateRecommendation } from '../lib/recommend';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      qualification: '',
      experience: '',
      profession: '',
      careerGoal: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const { recommendation, reason } = generateRecommendation({
        qualification: data.qualification,
        experience: data.experience,
        profession: data.profession,
        careerGoal: data.careerGoal,
      });

      // Check for duplicate email
      const { data: existingUser, error: checkError } = await supabase
        .from('submissions')
        .select('id')
        .eq('email', data.email)
        .maybeSingle();

      if (checkError) {
        console.error('Supabase check error:', checkError);
        toast.error('Failed to verify email. Please try again.');
        setIsSubmitting(false);
        return;
      }

      if (existingUser) {
        toast.error('This email has already been used for a submission.');
        setIsSubmitting(false);
        return;
      }

      const { error: dbError } = await supabase.from('submissions').insert({
        full_name: data.fullName,
        email: data.email,
        qualification: data.qualification,
        experience: data.experience,
        profession: data.profession,
        career_goal: data.careerGoal,
        recommendation,
        reason,
      });

      if (dbError) {
        console.error('Supabase insert error:', dbError);
        toast.error('Failed to save your submission. Please try again.');
        setIsSubmitting(false);
        return;
      }

      setResult({ recommendation, reason });
      toast.success('Profile submitted successfully!');
    } catch (err) {
      console.error('Submission error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    reset();
  };

  if (result) {
    return (
      <div className="max-w-xl mx-auto">
        <RecommendationCard
          recommendation={result.recommendation}
          reason={result.reason}
          onReset={handleReset}
        />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-100">
          Academic Pathway Recommendation
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill in your profile to receive a personalized pathway recommendation.
        </p>
      </div>

      <div className="rounded-lg border border-gray-800 bg-gray-900 p-5 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              id="fullName"
              label="Full Name"
              placeholder="Jane Doe"
              error={errors.fullName?.message}
              register={register('fullName')}
            />
            <FormField
              id="email"
              label="Email"
              type="email"
              placeholder="jane@example.com"
              error={errors.email?.message}
              register={register('email')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              id="qualification"
              label="Highest Qualification"
              options={QUALIFICATIONS}
              error={errors.qualification?.message}
              register={register('qualification')}
            />
            <FormField
              id="experience"
              label="Years of Experience"
              type="number"
              placeholder="5"
              error={errors.experience?.message}
              register={register('experience', { valueAsNumber: true })}
            />
          </div>

          <FormField
            id="profession"
            label="Current Profession"
            placeholder="Senior Software Engineer"
            error={errors.profession?.message}
            register={register('profession')}
          />

          <FormField
            id="careerGoal"
            label="Career Goal"
            placeholder="Describe your career aspirations in a few sentences…"
            rows={3}
            error={errors.careerGoal?.message}
            register={register('careerGoal')}
          />

          <div className="border-t border-gray-800 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              id="submit-profile"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing…
                </>
              ) : (
                'Get Recommendation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
