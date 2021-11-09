#!/usr/bin/env python3
from posixpath import lexists
from flask import Flask, request
from flask import jsonify
from flask_restful import Resource, Api
from flask_cors import CORS

import json

import os.path
import glob

from bson import ObjectId

from pymongo import MongoClient

from bson.json_util import dumps
from bson.json_util import loads


# init Flask app
app = Flask(__name__)
api = Api(app)
CORS(app)


class HelloWorld(Resource):
	def get(self):
		return "Hello there... "


class GetLocations(Resource):
	def get(self):
		ret = []
		# do stuff
		return ret


class PutLocation(Resource):
	def get(self, id):
		print("[checkpoint 1]")

		
api.add_resource(HelloWorld, '/')
api.add_resource(GetData, '/PutLocation/<string:id>')
api.add_resource(GetDateRanges, '/GetLocations')

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=48443, debug=True)
