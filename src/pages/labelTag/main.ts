const  main=async()=> {
    // const baseURL = "https://dev.laiout.app/api";
    const baseURL = "http://localhost:5000";
    const applicantDetails = {
      applicant_name: "Roy Chan", // Replace with your name
      email: "dreamhighpassionhigh@gmail.com" // Replace with your email
    };
    try {
      const res = await fetch(`${baseURL}/applicant/getFrontendChallenge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicantDetails)
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch challenge: ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log("Challenge Data:##", data);

      const challengeSecret = data.secret; // Get 'secret'
      
      
      const solution = sumOfDigits(challengeSecret.toString());
      
      console.log("challengeSecret:##", challengeSecret,solution,sumOfDigits2(challengeSecret));
      const solutionRes = await fetch(`${baseURL}/applicant/checkFrontendChallengeSolution`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            applicant_name: applicantDetails.applicant_name,
            email: applicantDetails.email,
            secret: solution
          }),
      });
      
      if (!solutionRes.ok) {
        throw new Error(`Failed to post solution: ${solutionRes.statusText}`);
      }
      
      const solutionData = await solutionRes.json();
      console.log("Final Secret:", solutionData.finalSecret); // final secret
      
      
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
  function sumOfDigits2(secret: number): number {
    const digits = secret.toString().split('');    
    const sum = digits.map(Number).reduce((sum, digit) => sum + digit, 0);
    return sum;
  }
  const sumOfDigits = (numString) => {
    return numString.split('').reduce((sum, digit) => sum + parseInt(digit), 0);
}
  export default main