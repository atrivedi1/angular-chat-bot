var Promise = require('bluebird');
var User = require('./user_model');

var missingInfo = function (userInfo) {
    console.log("checking to see if following user has missing params")
    var requiredParams = ["user_name", "first_name", "last_name", "work_experience", "highest_education", "degree", "school", "address", "linkedIn_URL"];

    for (var i = 0; i < requiredParams.length; i++) {
        var param = requiredParams[i];

        if (userInfo[param] === null) {
            console.log(param + " param is missing!");
            return param;
        }
    }

    console.log("user profile is complete!")
    return false;
};

var handleUserWithIncompleteProfile = function (user, messageId, data, resolve) {
    switch (data) {
        case "first_name":
            resolve({ message: "Welcome back " + user + "! It looks like I still do not have all your information. What is your first name?", infoType: "first_name" });
            break;

        case "last_name":
            if(messageId === 1) {
                resolve({ message: "Welcome back " + user + "! It looks like I still do not have all your information. What is your last name?", infoType: "last_name" });
            } else {
                resolve({ message: "Awesome. Thanks! What is your last name?", infoType: "last_name" });
            }

            break;

        case "work_experience":
            if(messageId === 1) {
                resolve({ message: "Welcome back " + user + " It looks like I still do not have all your information. Tell me a bit about your work experience.", infoType: "work_experience" });
            } else {
                resolve({ message: "You rock! What is your work experience?", infoType: "work_experience" })
            }

            break;

        case "highest_education":
            if(messageId === 1) {
                resolve({ message: "Welcome back " + user + " It looks like I still do not have all your information. What was the highest level of education you received?", infoType: "highest_education" });
            } else {
                resolve({ message: "Boom! Got it! What is your highest level of education?", infoType: "highest_education" })
            }
            
            break;

        case "degree":
            if(messageId === 1) {
                resolve({ message: "Welcome back " + user + " It looks like I still do not have all your information. What did you get your degree in?", infoType: "degree" });
            } else {
                resolve({ message: "Okay. What did you get your degree in?", infoType: "degree" })
            }

            break;

        case "school":
            if(messageId === 1){
                resolve({ message: "Welcome back " + user + " It looks like I still do not have all your information. What schools did you attend?", infoType: "school" });
            } else {
                resolve({ message: "Makes sense. What schools did you attend?", infoType: "school" })
            }
            
            break;

        case "address":
            if(messageId === 1) {
                resolve({ message: "Welcome back " + user + " It looks like I still do not have all your information. What is your address?", infoType: "address" });
            } else {
                resolve({ message: "Coolio. Real quick what is your address? I promise I am not a stalker.", infoType: "address" })
            }
            
            break;

        case "linkedIn_URL":
            if(messageId === 1) {
                resolve({ message: "Welcome back " + user + " It looks like I still do not have all your information. What is the URL for your linkedin profile?", infoType: "linkedIn_URL" });
            } else {
                resolve({ message: "Last one I promise! What is the URL for your linkedin profile?", infoType: "linkedIn_URL" })
            }
            
            break;
    }
};

var submitAdditionalBackgroundInfo = function (user, content, submissionType, cb) {
    console.log("trying to update " + submissionType + " field in user object with " + content);

    switch (submissionType) {
        case "first_name":
            User.findOneAndUpdate({ user_name: user }, { $set: { first_name: content } }, { upsert: true, new: true }, function(err, updatedInfo){
                if (err) { throw err; }

                console.log("first name successfully updated");
                return cb();
            });

            break;

        case "last_name":
            User.findOneAndUpdate({ user_name: user }, { $set: { last_name: content } }, { upsert: true, new: true }, function(err, updatedInfo){
                if (err) { throw err; }

                console.log("last name successfully updated");
                return cb();
            });
           
            break;

        case "work_experience":
           User.findOneAndUpdate({ user_name: user }, { $set: { work_experience: content } }, { upsert: true, new: true }, function(err, updatedInfo){
                if (err) { throw err; }

                console.log("work experience successfully updated");
                return cb();
            });
           
            break;

        case "highest_education":
            User.findOneAndUpdate({ user_name: user }, { $set: { highest_education: content } }, { upsert: true, new: true }, function(err, updatedInfo){
                if (err) { throw err; }

                console.log("highest education successfully updated");
                return cb();
            });
           
            break;

        case "degree":
            User.findOneAndUpdate({ user_name: user }, { $set: { degree: content } }, { upsert: true, new: true }, function(err, updatedInfo){
                if (err) { throw err; }

                console.log("degree successfully updated");
                return cb();
            });
           
            break;

        case "school":
            User.findOneAndUpdate({ user_name: user }, { $set: { school: content } }, { upsert: true, new: true }, function(err, updatedInfo){
                if (err) { throw err; }

                console.log("school successfully updated");
                return cb();
            });
           
            break;

        case "address":
            User.findOneAndUpdate({ user_name: user }, { $set: { address: content } }, { upsert: true, new: true }, function(err, updatedInfo){
                if (err) { throw err; }

                console.log("address successfully updated");
                return cb();
            });
           
            break;

        case "linkedIn_URL":
            User.findOneAndUpdate({ user_name: user }, { $set: { linkedIn_URL: content } }, { upsert: true, new: true }, function(err, updatedInfo){
                if (err) { throw err; }

                console.log("linkedin url successfully updated");
                return cb();
            });
           
            break;
    }
}

var handleQuery = function(user, param, reject, resolve) {
    User.findOne({ 'user_name': user}, param, function(err, result) {
        console.log("handling individual query!");

        if(err) { throw err; }
        //TODO: vary the responses up a bit
        else { resolve({ message: "Great question! If I recall correctly the answer is: " + result[param] + ". Is there anything else I can help you with today?", infoType: "userQuery" }) };
    })
}

var handleQueryFromUser = function (user, query, resolve, reject) {
    console.log("handing query from user!")
    //TODO: add regex to handle queries more intelligently
    
    if(query.search(/first name/i) !== -1) {
        handleQuery(user, "first_name", reject, resolve);
    } 

    else if(query.search(/last name/i) !== -1) {
        handleQuery(user, "last_name", reject, resolve);
    }

    else if(query.search(/work experience/i) !== -1){
         handleQuery(user, "work_experience", reject, resolve);
    }
    
    else if(query.search(/highest/i) !== -1 && query.search(/education/i) !== -1){
         handleQuery(user, "highest_education", reject, resolve);
    }

    else if(query.search(/degree/i) !== -1){
         handleQuery(user, "degree", reject, resolve);
    }

    else if(query.search(/school/i) !== -1){
         handleQuery(user, "school", reject, resolve);
    }

    else if(query.search(/address/i) !== -1){
         handleQuery(user, "address", reject, resolve);
    }
    
    else if(query.search(/linkedin/i) !== -1){
         handleQuery(user, "linkedIn_URL", reject, resolve);
    }

    else {
        resolve("Sorry, I could not quite understand that. Perhaps try asking your question in a different way.")
    }
}

var responder = function (user, messageContent, messageId, submissionType) {
    return new Promise(function (resolve, reject) {
        //IF messageID === 0;
        if (messageId === 0) {
            console.log("user hasn't posted any message yet; need to identify who they are");
            resolve("Hi! Please enter your username so I can better assist you.");
            return;
        }

        //ELSE IF messageID === 1;
        else if (messageId === 1) {
            console.log("user has submitted username");
            
            //search db for user
            User.findOne({ 'user_name': user }, function (err, userInfo) {
                //handle error
                if (err) { reject("Oops something broke!"); }

                //if user info doesn't exist in db, create new user and then ask demographic questions to populate user model
                if (userInfo === null) {
                    console.log("user not found; creating new user");

                    //create new user
                    var newUser = new User({ 
                        user_name: user, 
                        first_name: null,
                        last_name: null,
                        work_experience: null,
                        highest_education: null,
                        degree: null,
                        school: null,
                        address: null,
                        linkedIn_URL: null
                    });

                    //save new user
                    newUser.save(function(err) {
                        if(err) throw err;
                        console.log("new user successfully saved")
                        //greet new user
                        resolve({ message: "Hi " + user + "! It is nice to meet you! I would love to learn a little more about you. What is your first name?", infoType: "first_name" });
                    });
                }

                //if user IS in db BUT profile information is not completely filled out
                else if (userInfo && missingInfo(userInfo)) {
                    console.log("user found, but some info missing");
                    var infoNeeded = missingInfo(userInfo);
                    return handleUserWithIncompleteProfile(user, messageId, infoNeeded, resolve);
                }

                //if user IS in db AND profile information is completely filled out
                else {
                    console.log("user found and profile complete!");
                    resolve({ message: "Hi " + user + "! Welcome back! How can I help you today? If you have a question, I will do my best to answer it.", infoType: "userQuery" })
                }
            });
        }

        //ELSE for all other messages...
        else {
            console.log("subsequent message posted by user");

            //search for user's info in db
            User.findOne({ 'user_name': user }, function (err, userInfo) {
                //handle err
                if (err) { reject("Oops something broke!"); }
                
                //if user IS in db BUT profile information is not completely filled out...
                if (userInfo && missingInfo(userInfo)) {
                    console.log("user still needs to fill out some information");
                    
                    //submit inbound info and then check if any info is still missing
                    return submitAdditionalBackgroundInfo(user, messageContent, submissionType, function(){
                
                        User.findOne({ 'user_name': user }, function(err, updatedUserInfo){
                            //if info is missing, determine what info the user needs to provide next
                            if(missingInfo(updatedUserInfo)) {
                                console.log("updated user information:", updatedUserInfo)
                                var infoStillNeeded = missingInfo(updatedUserInfo);
                                return handleUserWithIncompleteProfile(user, messageId, infoStillNeeded, resolve);
                            } 
                            //otherwise, give user permission to start asking questions
                            else {
                                resolve("Awesome! I have everything I need. Feel free to ask me a question about your background.")
                            }
                        })
                    });
                }

                //if user IS in db AND profile information is completely filled out
                else {
                    console.log("user with complete profile posted a query");
                    
                    //if user wishes to end conversation 
                    if(submissionType === "userQuery" && (messageContent.search(/no/i) !== -1)) {
                        resolve({ message: "No problem! Have a great day " + user + "! I will talk to you soon =).", infoType: "endConversation" });
                    }

                    //if user asks a query
                    return handleQueryFromUser(user, messageContent, resolve, reject);
                }
            });
        }
    })
    .then(function(response){
        console.log("message being sent back up to client -->", response);
        return response;
    });
}


module.exports = responder;