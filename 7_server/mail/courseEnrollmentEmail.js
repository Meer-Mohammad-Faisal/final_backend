exports.courseEnrollmentEmail = (name, courseName) => {
    return `<!DOCTYPE html>
<html>
  
<head>
    <meta charset="UTF-8">
    <title>Course Registration Confirmation</title>
    <style>
        body {
            background-color: #ffffff;
            font-family: Arial, sans-serif;
            font-size: 16px;
            line-height: 1.4;
            color: #333333;
            margin: 0;
            padding: 0;
        }
            
        
        .container{
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
            
        .logo {
            max-width: 200px;
            margin-bottom: 20px;
        }
            
        .message {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
        }
            
        .body {
            font-size: 16px;
            margin-bottom: 20px;
        }
            
        `
}