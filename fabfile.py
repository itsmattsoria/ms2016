from fabric.api import *
import os

env.hosts = ['mattsoria.com']
env.user = 'poopsplat'
env.path = '~/Sites/ms2016'
env.remotepath = '/home/poopsplat/webapps/ms2016'
env.git_branch = 'master'
env.warn_only = True
env.remote_protocol = 'http'

def deploy():
  update()

def update():
  with cd(env.remotepath):
    run('git pull origin {0}'.format(env.git_branch))
